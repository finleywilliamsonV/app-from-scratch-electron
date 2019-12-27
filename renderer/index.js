const { ipcRenderer } = require('electron')
const $ = require('jquery')

$('#colorLabButton').on('click', () => {
    ipcRenderer.send('add-color-lab-window')
})

$('#jokeLabButton').on('click', () => {
    ipcRenderer.send('add-joke-lab-window')
})
