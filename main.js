const { app, shell, ipcMain } = require('electron')
const contextMenu = require('electron-context-menu')
const path = require('path')
const Window = require('./js/Window')

console.log('starting main process js')

const main = () => {
    const mainWindow = new Window({
        file: path.join('renderer', 'index.html'),
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // -----  COLOR LAB  -----
    let colorLabWindow

    // create color lab window
    ipcMain.on('add-color-lab-window', () => {
        if (!colorLabWindow) {
            colorLabWindow = new Window({
                file: path.join('renderer', 'color-lab', 'color-lab.html'),
                width: 400,
                height: 300,
                webPreferences: {
                    nodeIntegration: true
                },
                parent: mainWindow
            })

            colorLabWindow.on('closed', () => {
                colorLabWindow = null
            })
        }
    })
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
