const { app, shell, ipcMain, net } = require('electron')
const contextMenu = require('electron-context-menu')
const path = require('path')
const Window = require('./js/Window')

const main = () => {
    const mainWindow = new Window({
        file: path.join('renderer', 'index.html'),
        width: 600,
        height: 375,
        webPreferences: {
            nodeIntegration: true
        }
    })

    mainWindow.maximize()
}

// create/configure the context (right-click) menu
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

app.on('ready', main)
