const ffi = require('ffi')
const ref = require('ref')
const Struct = require('ref-struct')
const ArrayType = require('ref-array')

const { ulong } = ref.types
const { ushort } = ref.types
const { byte } = ref.types
const { char } = ref.types

const charPtr = ref.refType(char)

const TPCANHandle = ushort
const TPCANStatus = ulong
const TPCANBaudrate = ushort
const TPCANBitrateFD = charPtr

const TPCANTimestamp = Struct({
    // DWORD  millis;             // Base-value: milliseconds: 0.. 2^32-1
    // WORD   millis_overflow;    // Roll-arounds of millis
    // WORD   micros;             // Microseconds: 0..999
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
const TPCANMsgPtr = ref.refType(TPCANMsg);

const TPCANMsgFD = Struct({
    ID: ulong,
    MSGTYPE: byte,
    LEN: byte,
    DATA: ArrayType(byte, 8)
})
const TPCANMsgFDPtr = ref.refType(TPCANMsgFD)

const PCANBasic = ffi.Library('./PCANBasic.dll', {
    CAN_Initialize: [TPCANStatus, [TPCANHandle, TPCANBaudrate, 'int', 'int', 'int']],
    CAN_InitializeFD: [TPCANStatus, [TPCANHandle, TPCANBitrateFD]],
    CAN_Uninitialize: [TPCANStatus, [TPCANHandle]],
    CAN_Reset: [TPCANStatus, [TPCANHandle]],
    CAN_GetStatus: [TPCANStatus, [TPCANHandle]],
    CAN_Read: [TPCANStatus, [TPCANHandle, TPCANMsgPtr, TPCANTimestamp]],
    CAN_ReadFD: [TPCANStatus, [TPCANHandle, TPCANMsgFDPtr, TPCANTimestamp]],
    CAN_Write: [TPCANStatus, [TPCANHandle, TPCANMsg, TPCANTimestamp]],
})

const PCAN_USBBUS1 = 81
const PCAN_BAUD_50K = 18223
PCANBasic.CAN_Initialize(PCAN_USBBUS1, PCAN_BAUD_50K, 0, 0, 0)

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
