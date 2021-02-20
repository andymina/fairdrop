// use the node net package
const net = require('net');
// use dns for hostname
const dns = require('dns').promises;
// use fs for...files
const fs = require('fs').promises;
// use promises to resolve the socket
const { PromiseSocket } = require('promise-socket');
// gets users prompt
const prompt = require('prompt-sync')();
// app port
const PORT = 7329;

/**
 * Finds which users are currently available to receive items.
 * 
 * @returns an obj defining key/val pairs where key = hostname and val = IPv4
 */
const findReceivers = async () => {
    // set res
    const res = [];
    // set internal IPv4 prefix
    const HOST = '192.168.1.';
    // get the port to test
    const PORT = 7329;
    // loop through ip addresses
    for (let i = 1; i <= 255; i++) {
        // set ip
        let ip = HOST + String(i);
        // check the port
        let status = await checkPort(PORT, ip);
        // get the hostname
        if (status) {
            // retrieve device hostnames
            let hostnames = await dns.reverse(ip);
            // set primary hostname in res
            res.push({ name: hostnames[0], ip: ip });
        }
    }

    return res;
}

/**
 * Pretty prints the list of receivers.
 * 
 * @param receivers An array of receiving devices.s
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
    socket.setTimeout(2);
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
        console.log(`Connected to ${device.name}`);
        socket.write(data);
        console.log('Data sent');
    });
}

const main = async () => {
    // define data to be sent
    // let data = 'Hello from Sender!';
    const bytes = await fs.readFile('dog.jpg').catch((err) => console.log(err));
    // console.log(bytes);
    // find users able to receive
    let receivers = await findReceivers();
    // show user receivers
    console.log(prettyReceivers(receivers));
    // prompt user
    let option = prompt('Choose device # to send file to: ');
    // define data
    // connect to receiver
    console.log(receivers[option - 1]);
    sendData(receivers[option - 1], bytes);
}

// run entry point
main()// .catch(err => console.error('Fatal:', err));