'use strict';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'villaHermosaDesktop',
  Object.freeze({
    getIdentity: () => ipcRenderer.invoke('desktop:get-identity'),
  })
);
