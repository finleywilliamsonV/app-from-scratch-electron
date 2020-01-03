const { ipcRenderer } = require('electron')
const $ = require('jquery')
const ffi = require('ffi')
const ref = require('ref')
const Struct = require('ref-struct')

const ulong = ref.types.ulong
const byte = ref.types.byte

$('#colorLabButton').on('click', () => {
    ipcRenderer.send('add-color-lab-window')
})

$('#jokeLabButton').on('click', () => {
    ipcRenderer.send('add-joke-lab-window')
})

const myobj = ref.types.void // we don't know what the layout of "myobj" looks like
// const myobjPtr = ref.refType(myobj)

let MyLibrary = ffi.Library('./PCANBasic.dll', {
  "CAN_Initialize": [ ulong, [ ulong, ulong, 'int', 'int', 'int' ] ],
//   "create_object": [ myobjPtr, [] ],
//   "do_stuff_with_object": [ "double", [ myobjPtr ] ],
//   "use_string_with_object": [ "void", [ myobjPtr, "string" ] ],
//   "delete_object": [ "void", [ myobjPtr ] ]
});




const TPCANMsg = Struct({
    // eslint-disable-next-line quote-props
    'ID': ulong,
    'MSGTYPE': byte,
    'LEN': byte,
    // 'DATA': byte[8],
})

$('#ffi').on('click', () => {
    console.log('MyLibrary', MyLibrary.CAN_Initialize(81, 18223, 0, 0, 0));
})
