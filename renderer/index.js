const { ipcRenderer } = require('electron')
const $ = require('jquery')

console.log('starting renderer process js')

$('#colorLabButton').on('click', () => {
    ipcRenderer.send('add-color-lab-window')
})
