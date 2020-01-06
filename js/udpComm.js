const { uint16 } = ref.types
const { uint32 } = ref.types

// Sean: This way makes a bit more sense than below but it does not bit-pack the bytes properly which is necessary for our protocol to function
const DSCHeartbeat = Struct({
    Command: uint16,
    ObjectID: uint32,
    Status: uint16,
    HBRate: byte,
    FloorService: ArrayType(byte, 32),
    Month: byte,
    Day: byte,
    Year: byte,
    Hour: byte,
    Minute: byte,
    Second: byte
})

// Sean: I am not an advocate for this way, but it's the only way I can see it working unless we can get the above to bit-pack
const DSCHeartbeatJSON = {
    Packet: [
        {
            Command: {
                Type: 'UInt16',
                Value: 0x0000
            }
        },
        {
            ObjectID: {
                Type: 'UInt32',
                Value: 0x01000000
            }
        },
        {
            Status: {
                Type: 'UInt16',
                Value: 0x0800
            }
        },
        {
            HBRate: {
                Type: 'Byte',
                Value: 5
            }
        },
        {
            FloorService: {
                Type: 'Array',
                Value: Array(32).fill(0xFF)
            }
        },
        {
            Month: {
                Type: 'Byte',
                Value: 1
            }
        },
        {
            Day: {
                Type: 'Byte',
                Value: 3
            }
        },
        {
            Year: {
                Type: 'Byte',
                Value: 50 // since 1970
            }
        },
        {
            Hour: {
                Type: 'Byte',
                Value: 15
            }
        },
        {
            Minute: {
                Type: 'Byte',
                Value: 37
            }
        },
        {
            Second: {
                Type: 'Byte',
                Value: 0
            }
        }
    ]
}

// should work for any kiosk on Group 1
const PORT = 7039
const HOST = '192.168.0.255'

const dgram = require('dgram')

// let UDPtestMsg = Buffer.alloc('My KungFu is Good!'.length,'My KungFu is Good!');

// This uses the JSON structure to "bit-pack" manually
const heartbeatBuffer = []
DSCHeartbeatJSON["Packet"].forEach(params => {
    for (let param in params )
    {
        let item = params[param]
        if ( item["Type"] == "Byte" )
        {
            heartbeatBuffer.push(item["Value"])
        }
        else if ( item["Type"] == "UInt16" || item["Type"] == "UInt32" )
        {
            let value = item["Value"]
            let forLength = item["Type"] == "UInt16" ? 1 : 3;
            for ( i = forLength; i >= 0; i-- )
            {
                let val = (value >> (i*8) ) % 256;
                heartbeatBuffer.push(val)
            }
        }
        else if ( item["Type"] == "Array" )
        {
            let arrayLength = item["Value"].length
            for ( i = 0; i < arrayLength; i++ )
            {
                heartbeatBuffer.push(item["Value"][i])
            }
        }
    }
    
});

let UDPtestMsg = Buffer.from(heartbeatBuffer)

const client = dgram.createSocket('udp4')
client.bind(PORT)

// let server = dgram.createSocket('udp4');
// server.on('listening', function() {
//   const address = server.address();
//  console.log('UDP Server listening on ' + address.address + ':' + address.port);
// });

// server.on('message', function(message, remote) {
//  console.log(remote.address + ':' + remote.port +' - ' + message);
// });
// server.bind(PORT, HOST);

$('#UDPWrite').on('click', () => {
    client.send(UDPtestMsg, 0, UDPtestMsg.length, PORT, HOST, (err, bytes) => {
        if (err) throw err
        console.log(`UDP message sent to ${HOST}:${PORT}`)
        // client.close() //don't close the client
    })
})
