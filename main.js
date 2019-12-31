const { app, shell, ipcMain, net } = require('electron')
const contextMenu = require('electron-context-menu')
const path = require('path')
const Window = require('./js/Window')
const isJokeClean = require('./renderer/joke-lab/joke-filter')

const main = () => {
    const mainWindow = new Window({
        file: path.join('renderer', 'index.html'),
        width: 600,
        height: 375,
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

    // -----  JOKE LAB  -----
    let jokeLabWindow

    // create joke lab window
    ipcMain.on('add-joke-lab-window', () => {
        if (!jokeLabWindow) {
            jokeLabWindow = new Window({
                file: path.join('renderer', 'joke-lab', 'joke-lab.html'),
                width: 400,
                height: 600,
                webPreferences: {
                    nodeIntegration: true
                },
                parent: mainWindow
            })

            jokeLabWindow.on('closed', () => {
                jokeLabWindow = null
            })
        }
    })

    // make http request
    ipcMain.on('http-request', (e, args) => {
        // function to make the request
        const makeRequest = (url) => {
            const request = net.request(url)
            request.on('response', (res) => {
                if (res.statusCode === 200) {
                    res.on('data', (chunk) => {
                        const jokeJSON = JSON.parse(chunk)

                        if (isJokeClean(jokeJSON)) {
                            // return the data
                            e.sender.send('http-response', jokeJSON)
                        } else {
                            // make another request
                            makeRequest(url)
                        }
                    })
                } else if (res.statusCode === 429) {
                    e.sender.send('http-response', {
                        type: 'twopart',
                        setup: 'We\'ve made too many requests.',
                        delivery: 'This is not a joke. @___@'
                    })
                }
            })
            // finalize the request to send it
            request.end()
        }
        // make the request
        if (args.url) {
            makeRequest(args.url)
        }
    })

    // -----  FFI LAB  -----
    let ffiLabWindow

    // create ffi lab window
    ipcMain.on('add-ffi-lab-window', () => {
        if (!ffiLabWindow) {
            ffiLabWindow = new Window({
                file: path.join('renderer', 'ffi-lab', 'ffi-lab.html'),
                width: 400,
                height: 300,
                webPreferences: {
                    nodeIntegration: true
                },
                parent: mainWindow
            })

            ffiLabWindow.on('closed', () => {
                ffiLabWindow = null
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
