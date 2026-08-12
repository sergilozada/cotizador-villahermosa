'use strict';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'villaHermosaSetup',
  Object.freeze({
    getAdvisors: () => ipcRenderer.invoke('setup:get-advisors'),
    pairAdvisor: (username) => ipcRenderer.invoke('setup:pair-advisor', username),
  })
);
