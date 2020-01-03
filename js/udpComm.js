const PORT = 22;
const HOST = '192.168.0.252';

const dgram = require('dgram');

let UDPtestMsg = Buffer.alloc('My KungFu is Good!'.length,'My KungFu is Good!');

var client = dgram.createSocket('udp4');

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
    client.send(UDPtestMsg, 0, UDPtestMsg.length, PORT, HOST, function(err, bytes) {
        if (err) throw err;
        console.log('UDP message sent to ' + HOST +':'+ PORT);
        client.close();
    });
})