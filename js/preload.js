const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    getLocalStorageItem: (key) => {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.error('Error accessing localStorage:', e);
            return null;
        }
    },
    setLocalStorageItem: (key, value) => {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.error('Error setting localStorage item:', e);
        }
    },
    removeLocalStorageItem: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Error removing localStorage item:', e);
        }
    },
    send: (channel, data) => {
        ipcRenderer.send(channel, data);
    },
    on: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
});
