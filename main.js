const { app, BrowserWindow, ipcMain } = require('electron')
const url = require('url')
const path = require('path')

console.log('starting main process js')

let win

const createWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'renderer', 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // show dev tools
    win.webContents.openDevTools()
}

app.on('ready', createWindow)
