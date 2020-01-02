const { ipcRenderer } = require('electron')
const $ = require('jquery')
const ffi = require('ffi')

$('#colorLabButton').on('click', () => {
    ipcRenderer.send('add-color-lab-window')
})

$('#jokeLabButton').on('click', () => {
    ipcRenderer.send('add-joke-lab-window')
})

$('#ffi').on('click', () => {
    console.log('ffi', ffi)
})
