// use the node net package
const net = require('net');
// use the dns node package
const dns = require('dns').promises;
// use fs for...files
const fs = require('fs').promises;
// use os node package
const os = require('os');
// define port
const PORT = 7329;

// create a server
const server = net.createServer();
// listen for connection
server.on('connection', async (socket) => {
    // retrieve device hostnames
    let hostnames = await dns.reverse(socket.remoteAddress);
    // print incoming connection
    console.log(`Incoming connection:
        Device name: ${hostnames[0]} | IPv4: ${socket.remoteAddress}`);
    // keep the socket alive
    socket.setKeepAlive(true);
    // pass socket to handler
    handler(socket);
});

const handler = async (socket) => {
    // Received data
    socket.on('data', async (data) => await handleData(data));
    // On disconnect
    socket.on('end', async () => {
        await fs.writeFile('received_dog.jpg', file);
        console.log('Transfer complete')
    });
}

let file = Buffer.from([]);
const handleData = async (data) => {
    let bytes = Buffer.from(data);
    file = Buffer.concat([file, bytes]);
    console.log(file);
}

// listen for errors
server.on('error', (err) => {
    throw err;
});

// get default network interface
const { en0 } = os.networkInterfaces();
// get IPv4 address
const IPv4 = en0[1].address;
// open the server and listen
server.listen(PORT, IPv4, () => {
    console.log(`Listening on port ${PORT}`)
});
