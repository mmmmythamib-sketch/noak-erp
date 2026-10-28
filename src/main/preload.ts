import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('noakApi', {
  testDatabaseConnection: () => ipcRenderer.invoke('db:test-connection'),
  createBackup: () => ipcRenderer.invoke('backup:create'),
  listBackups: () => ipcRenderer.invoke('backup:list'),
  printDocument: () => ipcRenderer.invoke('app:print'),
});
