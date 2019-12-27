console.log('starting main process js')
const { app, BrowserWindow, ipcMain } = require('electron')
const url = require('url')
const path = require('path')

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

ipcMain.on('async-message', (e, args) => {
    console.log('async message received by main process, args:', args)

    e.sender.send('async-reply', 'async pong')
})

ipcMain.on('sync-message', (e, args) => {
    console.log('sync message received by main process, args:', args)

    e.returnValue = 'sync pong'
})

app.on('ready', createWindow)
