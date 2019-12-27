const { app, BrowserWindow, shell, ipcMain } = require('electron')
const contextMenu = require('electron-context-menu')
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

contextMenu({
    // eslint-disable-next-line no-unused-vars
    prepend: (defaultActions, params, browserWindow) => [
        {
            label: 'Search Google for “{selection}”',
            // Only show it when right-clicking text
            visible: params.selectionText.trim().length > 0,
            click: () => {
                shell.openExternal(`https://google.com/search?q=${encodeURIComponent(params.selectionText)}`)
            }
        }
    ]
})

app.on('ready', createWindow)
