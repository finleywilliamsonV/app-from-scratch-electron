const { ipcRenderer } = require('electron')
const $ = require('jquery')

$('#colorLabButton').on('click', () => {
    ipcRenderer.send('add-color-lab-window')
})

$('#jokeLabButton').on('click', () => {
    ipcRenderer.send('add-joke-lab-window')
})

$('#ffiLabButton').on('click', () => {
    ipcRenderer.send('add-ffi-lab-window')
})
