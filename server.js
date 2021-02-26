// use to connect and write data to receiver
const net = require('net');
// use to resolve hostname from ip address
const dns = require('dns').promises;
// use for file reading/writing
const fs = require('fs').promises;
// use for obtaining internal IP
const os = require('os');
// port used across active fairdrop devices
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
    // pass socket to handler
    handler(socket);
});

let totalBytes = Buffer.from([]);
const handler = async (socket) => {
    // Received data
    socket.on('data', (data) => {
        // update the total bytes
        totalBytes = Buffer.concat([totalBytes, Buffer.from(data)]);
    });
    // On end data tranmission
    socket.on('end', async () => await saveFile(totalBytes));
}

const saveFile = async (bytes) => {
    // grab the file object from bytes
    let file = JSON.parse(bytes);
    // convert bytes back into raw data
    file.bytes = Buffer.from(file.bytes.data);
    // write the file
    await fs.writeFile(file.name, file.bytes);
    // confirm
    console.log(`${file.name} saved`);
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
