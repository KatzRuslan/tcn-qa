import { app, BrowserWindow, Menu, ipcMain, shell, dialog } from 'electron';
import installExtension, { REDUX_DEVTOOLS } from 'electron-devtools-installer';
import * as path from 'node:path';
import * as os from 'node:os';
import * as fs from 'node:fs';
import * as crypto from 'node:crypto';

function buildFilename(): string {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mmm = now.toLocaleString('en', { month: 'short' });
    const dd = String(now.getDate()).padStart(2, '0');
    const uid = crypto.randomBytes(4).toString('hex');
    return `templates-errors-${yyyy}-${mmm}-${dd}-${uid}.xlsx`;
}

const isDev = process.env['NODE_ENV'] === 'development';

function createWindow(): void {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    if (isDev) {
        win.loadURL('http://localhost:4208');
        win.webContents.openDevTools();
    } else {
        win.loadFile(path.join(__dirname, '../angular/browser/index.html'));
    }

    const menuTemplate: Electron.MenuItemConstructorOptions[] = [
        {
            label: 'Application',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'Ctrl+R',
                    click: () => win.reload(),
                },
                {
                    label: 'Open DevTools',
                    accelerator: 'F12',
                    click: () => win.webContents.openDevTools(),
                },
                {
                    label: 'Close DevTools',
                    // accelerator: 'F12',
                    click: () => win.webContents.closeDevTools(),
                },
                { type: 'separator' },
                { role: 'quit' },
            ],
        }
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
}


ipcMain.handle('open-excel', async (_e, buffer: ArrayBuffer) => {
    const filePath = path.join(os.tmpdir(), buildFilename());
    fs.writeFileSync(filePath, Buffer.from(buffer));
    return shell.openPath(filePath);
});
ipcMain.handle('save-excel', async (_e, buffer: ArrayBuffer) => {
    const { filePath } = await dialog.showSaveDialog({
        defaultPath: buildFilename(),
        filters: [{ name: 'Excel', extensions: ['xlsx'] }],
    });
    if (!filePath) return;
    fs.writeFileSync(filePath, Buffer.from(buffer));
    shell.openPath(filePath);
});

app.whenReady().then(async () => {
    if (isDev) {
        await installExtension(REDUX_DEVTOOLS).catch(console.error);
    }
    createWindow();

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
