console.log('starting renderer process js')
const $ = require('jquery')

let count = 0
$('#click-counter').text(count.toString())
$('#countbtn').on('click', () => {
    count++
    $('#click-counter').text(count)
})


const { ipcRenderer } = require('electron')

// Synchronous message emmiter and handler
console.log(ipcRenderer.sendSync('sync-message', 'sync ping'))

// Async message handler
ipcRenderer.on('async-reply', (event, args) => {
    console.log('async message received by renderer, args:', args)
})

// Async message sender
ipcRenderer.send('async-message', 'async ping')
