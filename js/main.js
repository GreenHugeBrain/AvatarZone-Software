const { app, BrowserWindow, ipcMain, Menu, shell } = require('electron');
const path = require('path');

let mainWindow;

function createWindow(file) {
    if (mainWindow) {
        mainWindow.close(); // დახუროს არსებული ფანჯარა, თუ არსებობს
    }

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
            enableRemoteModule: false,
            devTools: false
        },
        frame: true,
    });

    mainWindow.loadFile(file);

    // აპლიკაციის მენიუს გათიშვა
    Menu.setApplicationMenu(null);

    // IPC სიგნალები გარეგანი URL-ის გახსნისთვის
    ipcMain.on('open-external', (event, url) => {
        shell.openExternal(url);
    });
}

function checkAuth() {
    mainWindow.webContents.send('check-auth');
}

app.whenReady().then(() => {
    createWindow('login.html');

    ipcMain.on('auth-status', (event, isAuthenticated) => {
        if (isAuthenticated) {
            createWindow('index.html');
        } else {
            createWindow('login.html');
        }
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow('login.html');
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
