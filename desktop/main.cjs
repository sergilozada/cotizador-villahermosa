'use strict';

const { app, BrowserWindow, Menu, dialog, ipcMain, safeStorage, session } = require('electron');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const APP_ORIGIN = 'https://cotizadorvillahermosa.netlify.app';
const APP_URL = `${APP_ORIGIN}/`;
const APP_PARTITION = 'persist:villa-hermosa-desktop';
const APP_NAME = 'Cotizador Villa Hermosa';
const CONFIG_VERSION = 1;

const ADVISORS = Object.freeze([
  Object.freeze({ username: 's.lozada', displayName: 'Sergi Lozada', registration: '' }),
  Object.freeze({ username: 't.lozada', displayName: 'Theo Lozada Villegas', registration: '14661-PN-MVCS' }),
  Object.freeze({ username: 'j.talavera', displayName: 'Julio Talavera', registration: '23773-PN-MVCS' }),
]);

app.enableSandbox();

const stableUserDataPath = path.join(app.getPath('appData'), APP_NAME);
app.setPath('userData', stableUserDataPath);

const CONFIG_PATH = path.join(stableUserDataPath, 'device-assignment.json');
const SETUP_HTML_PATH = path.join(__dirname, 'setup', 'index.html');
const SETUP_URL = pathToFileURL(SETUP_HTML_PATH).toString();

let mainWindow = null;
let setupWindow = null;
let pairedAdvisor = null;
let storedAdvisor = null;
let resettingDevice = false;

const publicAdvisor = (advisor) => ({
  username: advisor.username,
  displayName: advisor.displayName,
  registration: advisor.registration,
});

const findAdvisor = (username) =>
  ADVISORS.find((advisor) => advisor.username === String(username || '').trim().toLowerCase()) || null;

const isAllowedAppUrl = (rawUrl) => {
  try {
    const parsed = new URL(rawUrl);
    return parsed.protocol === 'https:' && parsed.origin === APP_ORIGIN;
  } catch {
    return false;
  }
};

const ensureExactSender = (event, expectedWindow, expectedUrl) => {
  if (!expectedWindow || expectedWindow.isDestroyed()) return false;
  if (event.sender !== expectedWindow.webContents) return false;
  if (event.senderFrame !== event.sender.mainFrame) return false;
  return expectedUrl(event.senderFrame.url);
};

const saveAssignment = async (advisor) => {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error('Windows no pudo proteger la asignación de este equipo.');
  }

  const encrypted = safeStorage.encryptString(
    JSON.stringify({ version: CONFIG_VERSION, username: advisor.username })
  );
  const document = JSON.stringify({
    version: CONFIG_VERSION,
    payload: encrypted.toString('base64'),
  });

  await fs.mkdir(stableUserDataPath, { recursive: true });
  const temporaryPath = `${CONFIG_PATH}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(temporaryPath, document, { encoding: 'utf8', mode: 0o600 });

  try {
    await fs.copyFile(temporaryPath, CONFIG_PATH);
  } finally {
    await fs.rm(temporaryPath, { force: true });
  }
};

const loadAssignment = async () => {
  try {
    const stat = await fs.stat(CONFIG_PATH);
    if (stat.size <= 0 || stat.size > 4096) return null;

    const document = JSON.parse(await fs.readFile(CONFIG_PATH, 'utf8'));
    if (document?.version !== CONFIG_VERSION || typeof document.payload !== 'string') {
      return null;
    }
    if (!safeStorage.isEncryptionAvailable()) return null;

    const decrypted = safeStorage.decryptString(Buffer.from(document.payload, 'base64'));
    const assignment = JSON.parse(decrypted);
    if (assignment?.version !== CONFIG_VERSION || typeof assignment.username !== 'string') {
      return null;
    }

    return findAdvisor(assignment.username);
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      console.error('No se pudo leer la asignación del equipo:', error.message);
    }
    return null;
  }
};

const protectWebContents = (webContents, { allowSetup = false } = {}) => {
  webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  webContents.on('will-attach-webview', (event) => event.preventDefault());
  webContents.on('will-navigate', (event, destination) => {
    const allowed = allowSetup ? destination === SETUP_URL : isAllowedAppUrl(destination);
    if (!allowed) event.preventDefault();
  });
  webContents.on('will-redirect', (event, destination) => {
    if (!isAllowedAppUrl(destination)) event.preventDefault();
  });
};

const configureAppSession = () => {
  const appSession = session.fromPartition(APP_PARTITION);

  appSession.setPermissionCheckHandler((_webContents, permission, requestingOrigin) => {
    return permission === 'clipboard-sanitized-write' && requestingOrigin === APP_ORIGIN;
  });

  appSession.setPermissionRequestHandler((webContents, permission, callback, details) => {
    const requestingUrl = details?.requestingUrl || webContents.getURL();
    callback(permission === 'clipboard-sanitized-write' && isAllowedAppUrl(requestingUrl));
  });

  appSession.on('will-download', (event) => event.preventDefault());
};

const installApplicationMenu = () => {
  const advisorLabel = pairedAdvisor
    ? `Agente activo: ${pairedAdvisor.displayName}`
    : 'Selecciona el agente de esta sesión';

  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: 'Aplicación',
        submenu: [
          { label: advisorLabel, enabled: false },
          { type: 'separator' },
          {
            label: 'Cambiar agente…',
            enabled: Boolean(pairedAdvisor),
            click: () => resetDeviceAssignment(),
          },
          { type: 'separator' },
          { role: 'quit', label: 'Salir' },
        ],
      },
      {
        label: 'Vista',
        submenu: [
          { role: 'reload', label: 'Recargar' },
          { role: 'togglefullscreen', label: 'Pantalla completa' },
        ],
      },
    ])
  );
};

const createSetupWindow = () => {
  if (setupWindow && !setupWindow.isDestroyed()) {
    setupWindow.focus();
    return;
  }

  installApplicationMenu();

  setupWindow = new BrowserWindow({
    width: 720,
    height: 760,
    minWidth: 640,
    minHeight: 680,
    resizable: true,
    autoHideMenuBar: false,
    title: `${APP_NAME} · Configuración`,
    backgroundColor: '#0e2542',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'setup-preload.cjs'),
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      webviewTag: false,
      navigateOnDragDrop: false,
      devTools: !app.isPackaged,
    },
  });

  protectWebContents(setupWindow.webContents, { allowSetup: true });
  setupWindow.once('ready-to-show', () => setupWindow?.show());
  setupWindow.on('closed', () => {
    setupWindow = null;
  });
  setupWindow.loadFile(SETUP_HTML_PATH);
};

const createMainWindow = () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.focus();
    return;
  }

  installApplicationMenu();

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 940,
    minWidth: 980,
    minHeight: 720,
    autoHideMenuBar: false,
    title: APP_NAME,
    backgroundColor: '#f4f4ef',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'app-preload.cjs'),
      partition: APP_PARTITION,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      webviewTag: false,
      experimentalFeatures: false,
      navigateOnDragDrop: false,
      devTools: !app.isPackaged,
    },
  });

  protectWebContents(mainWindow.webContents);
  mainWindow.once('ready-to-show', () => mainWindow?.show());
  mainWindow.webContents.on('did-fail-load', (_event, errorCode, _description, validatedUrl, isMainFrame) => {
    if (!isMainFrame || errorCode === -3 || !isAllowedAppUrl(validatedUrl)) return;
    mainWindow?.loadFile(path.join(__dirname, 'offline.html'));
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  mainWindow.loadURL(APP_URL);
};

const clearAdvisorSiteData = async () => {
  const appSession = session.fromPartition(APP_PARTITION);
  await appSession.clearStorageData({
    origin: APP_ORIGIN,
    storages: ['cookies', 'localstorage', 'indexdb', 'serviceworkers', 'cachestorage'],
  });
  await appSession.clearCache();
};

async function resetDeviceAssignment() {
  if (resettingDevice || !pairedAdvisor) return;

  const confirmation = await dialog.showMessageBox(mainWindow || setupWindow, {
    type: 'warning',
    buttons: ['Cancelar', 'Cambiar agente'],
    defaultId: 0,
    cancelId: 0,
    title: 'Cambiar agente',
    message: '¿Elegir otro agente para esta sesión?',
    detail:
      'Se cerrará el cotizador actual. Si eliges otro agente, se borrará el historial local para proteger los datos de clientes.',
  });

  if (confirmation.response !== 1) return;

  resettingDevice = true;
  const previousAdvisor = pairedAdvisor;
  try {
    pairedAdvisor = null;

    createSetupWindow();
    if (mainWindow && !mainWindow.isDestroyed()) mainWindow.destroy();
  } catch (error) {
    pairedAdvisor = previousAdvisor;
    installApplicationMenu();
    await dialog.showMessageBox({
      type: 'error',
      title: 'No se pudo cambiar el agente',
      message: 'No se pudo abrir el selector de agentes.',
      detail: error.message,
    });
  } finally {
    resettingDevice = false;
  }
}

const registerIpcHandlers = () => {
  ipcMain.handle('setup:get-advisors', (event) => {
    if (!ensureExactSender(event, setupWindow, (url) => url === SETUP_URL)) {
      throw new Error('Solicitud no autorizada.');
    }
    return ADVISORS.map(publicAdvisor);
  });

  ipcMain.handle('setup:pair-advisor', async (event, username) => {
    if (!ensureExactSender(event, setupWindow, (url) => url === SETUP_URL)) {
      throw new Error('Solicitud no autorizada.');
    }
    if (pairedAdvisor) throw new Error('Este equipo ya tiene un agente asignado.');
    if (typeof username !== 'string' || username.length > 32) {
      throw new Error('El agente seleccionado no es válido.');
    }

    const advisor = findAdvisor(username);
    if (!advisor) throw new Error('El agente seleccionado no es válido.');
    if (!safeStorage.isEncryptionAvailable()) {
      throw new Error('Windows no pudo proteger la selección de este equipo.');
    }

    // Keep the same advisor's local history, but never expose it to another advisor.
    if (!storedAdvisor || storedAdvisor.username !== advisor.username) {
      await clearAdvisorSiteData();
    }
    await saveAssignment(advisor);
    storedAdvisor = advisor;
    pairedAdvisor = advisor;

    createMainWindow();
    if (setupWindow && !setupWindow.isDestroyed()) setupWindow.destroy();
    return publicAdvisor(advisor);
  });

  ipcMain.handle('desktop:get-identity', (event) => {
    if (!ensureExactSender(event, mainWindow, isAllowedAppUrl) || !pairedAdvisor) {
      throw new Error('Identidad de escritorio no disponible.');
    }
    return publicAdvisor(pairedAdvisor);
  });
};

const hasSingleInstanceLock = app.requestSingleInstanceLock();
if (!hasSingleInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    const activeWindow = mainWindow || setupWindow;
    if (!activeWindow || activeWindow.isDestroyed()) return;
    if (activeWindow.isMinimized()) activeWindow.restore();
    activeWindow.show();
    activeWindow.focus();
  });

  app.whenReady().then(async () => {
    configureAppSession();
    registerIpcHandlers();
    storedAdvisor = await loadAssignment();
    pairedAdvisor = null;

    createSetupWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length) return;
      pairedAdvisor = null;
      createSetupWindow();
    });
  });
}

app.on('window-all-closed', () => app.quit());
