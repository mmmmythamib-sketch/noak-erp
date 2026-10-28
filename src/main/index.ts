import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { DatabaseManager } from '../core/database/connection';
import { BackupService } from '../core/services/backup.service';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'NOAK ERP — نظام إدارة موارد شركة نوك للنجارة والألمنيوم',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  // IPC Handlers
  ipcMain.handle('db:test-connection', async () => {
    const db = DatabaseManager.getInstance();
    return db.testConnection();
  });

  ipcMain.handle('backup:create', async () => {
    const backupService = new BackupService();
    return backupService.createBackup('admin-system', 'مدير النظام');
  });

  ipcMain.handle('backup:list', async () => {
    const backupService = new BackupService();
    return backupService.listBackups();
  });

  ipcMain.handle('app:print', async () => {
    if (mainWindow) {
      mainWindow.webContents.print({ silent: false, printBackground: true });
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
