// use to connect and write data to receiver
const net = require('net');
// use to resolve hostname from ip address
const dns = require('dns').promises;
// use for file reading/writing
const fs = require('fs').promises;
// use for handling paths
const path = require('path');
// use for a promised based approach to net
const { PromiseSocket } = require('promise-socket');
// use to get user prompt
const prompt = require('prompt-sync')();
// port used across active fairdrop devices
const PORT = 7329;

/**
 * Finds which users are currently available to receive items.
 * 
 * @returns an array of device objects.
 * 
 * A device object:
 * { name: <String>, ip: <String> }
 */
const findReceivers = async () => {
    // set result array
    const res = [];
    // set internal IPv4 prefix
    const HOST = '192.168.1.';
    // loop through potential ip addresses
    for (let i = 1; i <= 255; i++) {
        // set ip
        let ip = HOST + String(i);
        // check if this device is running fairdrop
        let status = await checkPort(PORT, ip);
        if (status) {
            // retrieve device hostnames
            let hostnames = await dns.reverse(ip);
            // set primary hostname in res and push device object
            res.push({ name: hostnames[0], ip: ip });
        }
    }

    return res;
}

/**
 * Pretty prints the list of receivers.
 * 
 * @param receivers An array of receiving device objects.
 * @returns A string formatted to be pretty printed
 */
const prettyReceivers = (receivers) => {
    // define res
    let res = '';
    // loop through and format
    for (let i = 0; i < receivers.length; i++) {
        res += `${i + 1}. ${receivers[i].name}`;
    }
    return res;
}

/**
 * Checks if the current host has the specified port open.
 * 
 * @param host the IPv4 of the host
 * @param port the port to probe
 * @return true if the port is open; false otherwise
 */
const checkPort = async (port, host) => {
    // create a socket
    const socket = new PromiseSocket(new net.Socket());
    // set the timeout
    socket.setTimeout(5);
    // connect
    try {
        // connect to host @ port
        await socket.connect(port, host);
        await socket.destroy();
        return true;
    } catch (err) {
        return false;
    }
}

/**
 * Prepares a file to be sent by creating a Buffer from a file object.
 * A file object: {
 *   name: <String>
 *   bytes: <Buffer>
 * }
 * 
 * @param file_path The path to the file to be sent.
 * @returns A buffer of the file object
 */
const prepareFileData = async (file_path) => {
    // create a file object to send
    const file = {};
    // get the file name and ext
    file.name = path.basename(file_path);
    file_path = file_path.replace('\\', '');
    // open the file and read the bytes
    file.bytes = await fs.readFile(file_path).catch(err => console.log(err));
    // convert file JSON to string to buffer
    return Buffer.from(JSON.stringify(file));
}

/**
 * Sends data from client to server (sender to receiver).
 * 
 * @param device An obj that contains the sender's hostname and ip.
 * @param data The data to be sent.
 */
const sendData = (device, data) => {
    // create a socket
    const socket = new net.Socket();
    // connect and write data 
    // @TODO: prompt receiver
    socket.connect({ port: PORT, host: device.ip }, () => {
        // display connection status
        console.log(`Connected to ${device.name}`);
        // write data to receiver
        socket.write(data);
        // end connection on finish writing
        socket.end();
        // display status to user
        console.log('Data sent');
    });
}

const send = async (device, file_path) => {
    let data = await prepareFileData(file_path);
    sendData(device, data);
}

/**
 * Entry point for file sending with fairdrop.
 */
const main = async () => {
    // prompt user for path to file to be sent
    const file_path = prompt('Drag the file to be sent here: ').trim();
    // search for receivers
    console.log('\nSearching for receivers...\n');
    // find users able to receive
    let receivers = await findReceivers();
    // show user receivers
    console.log(prettyReceivers(receivers));
    // prompt user
    const option = prompt('Choose device # to send file to: ');
    // get device from receiver list
    const device = receivers[option - 1];
    // show user their selection
    console.log(`Sending ${file_path} to ${device.name}`);
    // send the data
    send(device, file_path);
}

// run entry point
main().catch(err => console.error('Fatal:', err));