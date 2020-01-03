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

// Init DLL
const PCAN_USBBUS1 = 81
const PCAN_BAUD_50K = 18223
PCANBasic.CAN_Initialize(PCAN_USBBUS1, PCAN_BAUD_50K, 0, 0, 0)

// Button events
const TPCANInit = new TPCANMsg({
    ID: 1536,
    MSGTYPE: 0,
    LEN: 1,
    DATA: [1, 0, 0, 0, 0, 0, 0, 0]
})

$('#PCANWrite').on('click', () => {
    console.log(PCANBasic.CAN_Write(PCAN_USBBUS1, TPCANInit, 0))
})

$('#PCANRead').on('click', () => {
    const emptyMessage = ref.alloc(TPCANMsg)
    console.log(PCANBasic.CAN_Read(PCAN_USBBUS1, emptyMessage, 0))
    console.log('READ', emptyMessage.deref())
})
