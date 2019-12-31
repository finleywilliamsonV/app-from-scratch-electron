/* eslint-disable quote-props */
const ffi = require('@saleae/ffi')
const ref = require('@saleae/ref')
const Struct = require('ref-struct')

const { int } = ref.types

/*
    I CANNOT FOR THE LIFE OF ME FIGURE OUT HOW TO CONVERT THESE DINGUS DATA TYPES TO JS
*/

const TPCANMsg = Struct({
    // eslint-disable-next-line quote-props
    'ID': 'Uint32Array',
    'MSGTYPE': '',
    'LEN': '',
    'DATA[8]': '',
})
/*


typedef struct tagTPCANMsg
{
    DWORD             ID;      // 11/29-bit message identifier
    TPCANMessageType  MSGTYPE; // Type of the message
    BYTE              LEN;     // Data Length Code of the message (0..8)
    BYTE              DATA[8]; // Data of the message (DATA[0]..DATA[7])
} TPCANMsg;

*/

const TPCANMsgPtr = ref.refType(TPCANMsg)

const canLibLoc = '../../PCANBasic.dll'

const CAN = ffi.Library(canLibLoc, {
    'CAN_Write': ['Uint32Array', ['Uint16Array', TPCANMsgPtr]]
})

module.exports = CAN
