import { app, BrowserWindow, Menu } from 'electron';
import installExtension, { REDUX_DEVTOOLS } from 'electron-devtools-installer';
import * as path from 'node:path';

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
