const { ipcRenderer } = require('electron')
const $ = require('jquery')

console.log('starting renderer process js')

let count = 0
$('#click-counter').text(count.toString())
$('#countbtn').on('click', () => {
    count++
    $('#click-counter').text(count)
})
