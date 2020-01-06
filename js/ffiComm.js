// imports
const ffi = require('ffi')
const ref = require('ref')
const Struct = require('ref-struct')
const ArrayType = require('ref-array')

// Types
const { ulong } = ref.types
const { ushort } = ref.types
const { byte } = ref.types
const { char } = ref.types
const { ulonglong } = ref.types
const voidType = ref.types.void
const voidPtr = ref.refType(voidType)
const charPtr = ref.refType(char)

const TPCANHandle = ushort
const TPCANStatus = ulong
const TPCANParameter = byte
// const TPCANDevice = byte
// const TPCANMessageType = byte
const TPCANType = byte
const TPCANMode = byte
const TPCANBaudrate = ushort
const TPCANBitrateFD = charPtr
const TPCANTimestampFD = ulonglong

const TPCANTimestamp = Struct({
    millis: ulong,
    millis_overflow: ushort,
    micros: ushort
})

const TPCANMsg = Struct({
    ID: ulong,
    MSGTYPE: byte,
    LEN: byte,
    DATA: ArrayType(byte, 8)
})
const TPCANMsgPtr = ref.refType(TPCANMsg)

const TPCANMsgFD = Struct({
    ID: ulong,
    MSGTYPE: byte,
    DLC: byte,
    DATA: ArrayType(byte, 64)
})
const TPCANMsgFDPtr = ref.refType(TPCANMsgFD)

// Set up PCANBasic DLL library
const PCANBasic = ffi.Library('./PCANBasic.dll', {
    CAN_Initialize: [TPCANStatus, [TPCANHandle, TPCANBaudrate, TPCANType, ulong, ushort]],
    CAN_InitializeFD: [TPCANStatus, [TPCANHandle, TPCANBitrateFD]],
    CAN_Uninitialize: [TPCANStatus, [TPCANHandle]],
    CAN_Reset: [TPCANStatus, [TPCANHandle]],
    CAN_GetStatus: [TPCANStatus, [TPCANHandle]],
    CAN_Read: [TPCANStatus, [TPCANHandle, TPCANMsgPtr, TPCANTimestamp]],
    CAN_ReadFD: [TPCANStatus, [TPCANHandle, TPCANMsgFDPtr, TPCANTimestampFD]],
    CAN_Write: [TPCANStatus, [TPCANHandle, TPCANMsg, TPCANTimestamp]],
    CAN_WriteFD: [TPCANStatus, [TPCANHandle, TPCANMsgFDPtr]],
    CAN_FilterMessages: [TPCANStatus, [TPCANHandle, ulong, ulong, TPCANMode]],
    CAN_GetValue: [TPCANStatus, [TPCANHandle, TPCANParameter, voidPtr, ulong]],
    CAN_SetValue: [TPCANStatus, [TPCANHandle, TPCANParameter, voidPtr, ulong]],
    CAN_GetErrorText: [TPCANStatus, [TPCANStatus, ushort, TPCANBitrateFD]]
})


function showInitiatedButtons(show) {
    if (show) {
        $('#InitPCAN').hide()
        $('#PCANButtons').show()
    } else {
        $('#PCANButtons').hide()
        $('#InitPCAN').show()
    }
}

// PCAN Send Method
function sendPCAN(command, inputs) {
    let status
    switch (command) {
    case 'CAN_Initialize':
        status = PCANBasic.CAN_Initialize(...inputs)
        break
    case 'CAN_Uninitialize':
        status = PCANBasic.CAN_Uninitialize(inputs)
        break
    case 'CAN_Reset':
        status = PCANBasic.CAN_Reset(inputs)
        break
    case 'CAN_GetStatus':
        status = PCANBasic.CAN_GetStatus(inputs)
        break
    case 'CAN_Read':
        status = PCANBasic.CAN_Read(...inputs)
        break
    case 'CAN_Write':
        status = PCANBasic.CAN_Write(...inputs)
        break
    case 'CAN_FilterMessages':
        status = PCANBasic.CAN_FilterMessages(...inputs)
        break
    case 'CAN_GetValue':
        status = PCANBasic.CAN_GetValue(...inputs)
        break
    case 'CAN_SetValue':
        status = PCANBasic.CAN_SetValue(...inputs)
        break
    case 'CAN_GetErrorText':
        status = PCANBasic.CAN_GetErrorText(...inputs)
        break
    default:
        break
    }
    if (status !== 0) {
        console.log(command, 'failed')
    } else {
        console.log(command, 'passed')
        if (command === 'CAN_Initialize') {
            showInitiatedButtons(true)
        } else if (command === 'CAN_Uninitialize') {
            showInitiatedButtons(false)
        }
    }
}


// Initialize DLL
const PCAN_USBBUS1 = 81
const PCAN_BAUD_50K = 18223
sendPCAN('CAN_Initialize', [PCAN_USBBUS1, PCAN_BAUD_50K, 0, 0, 0])

// Temporary variables
const TPCANWRITEmsg = new TPCANMsg({
    ID: 1536,
    MSGTYPE: 0,
    LEN: 1,
    DATA: [1, 0, 0, 0, 0, 0, 0, 0]
})

// Button events
$('#PCANInitialize').on('click', () => {
    sendPCAN('CAN_Initialize', [PCAN_USBBUS1, PCAN_BAUD_50K, 0, 0, 0])
})

$('#PCANUninitialize').on('click', () => {
    sendPCAN('CAN_Uninitialize', [PCAN_USBBUS1])
})

$('#PCANReset').on('click', () => {
    sendPCAN('CAN_Reset', [PCAN_USBBUS1])
})

$('#CAN_GetStatus').on('click', () => {
    sendPCAN('CAN_GetStatus', [PCAN_USBBUS1])
})

$('#PCANRead').on('click', () => {
    const emptyMessage = ref.alloc(TPCANMsg)
    sendPCAN('CAN_Read', [PCAN_USBBUS1, emptyMessage, 0])
    console.log('emptyMessage', emptyMessage)
})

$('#PCANWrite').on('click', () => {
    sendPCAN('CAN_Write', [PCAN_USBBUS1, TPCANWRITEmsg, 0])
})

// CAN_FilterMessages: [TPCANStatus, [TPCANHandle, ulong, ulong, TPCANMode]],
$('#PCAN_FilterMessages').on('click', () => {
    sendPCAN('CAN_FilterMessages', [PCAN_USBBUS1, 0, 0, 0])
})

// CAN_GetValue: [TPCANStatus, [TPCANHandle, TPCANParameter, voidPtr, ulong]],
$('#PCAN_GetValue').on('click', () => {
    sendPCAN('CAN_GetValue', [PCAN_USBBUS1, 0, voidPtr, 0])
})

// CAN_SetValue: [TPCANStatus, [TPCANHandle, TPCANParameter, voidPtr, ulong]],
$('#PCAN_SetValue').on('click', () => {
    sendPCAN('CAN_SetValue', [PCAN_USBBUS1, 0, voidPtr, 0])
})

// CAN_GetErrorText: [TPCANStatus, [TPCANStatus, ushort, TPCANBitrateFD]]
$('#PCAN_GetErrorText').on('click', () => {
    sendPCAN('CAN_GetErrorText', [PCAN_USBBUS1, 0, 0])
})