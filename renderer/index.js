const { ipcRenderer } = require('electron')
const $ = require('jquery')
const ffi = require('ffi')
const ref = require('ref')

$('#colorLabButton').on('click', () => {
    ipcRenderer.send('add-color-lab-window')
})

$('#jokeLabButton').on('click', () => {
    ipcRenderer.send('add-joke-lab-window')
})

$('#ffi').on('click', () => {
    console.log('ffi', ffi)
    console.log('ref.types', ref.types);
})

const myobj = ref.types.void // we don't know what the layout of "myobj" looks like
const myobjPtr = ref.refType(myobj)

let MyLibrary = ffi.Library('../pCAN/PCANBasic.dll', {
  "do_some_number_fudging": [ 'double', [ 'double', 'int' ] ],
//   "create_object": [ myobjPtr, [] ],
//   "do_stuff_with_object": [ "double", [ myobjPtr ] ],
//   "use_string_with_object": [ "void", [ myobjPtr, "string" ] ],
//   "delete_object": [ "void", [ myobjPtr ] ]
});