import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    platform: process.platform,
    getConfig: () => ipcRenderer.invoke('get-config'),
    openExcel: (buffer: ArrayBuffer) => ipcRenderer.invoke('open-excel', buffer),
    saveExcel: (buffer: ArrayBuffer) => ipcRenderer.invoke('save-excel', buffer),
});
