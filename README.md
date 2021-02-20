# fairdrop

'fairdrop' is an Apple Airdrop clone. fairdrop, name still in progress, is meant to be a substitute for Airdrop.

## Airdrop vs. fairdrop
- Airdrop only works between Apple devices whereas fairdrop can be used between any device that can run node.js.
- Airdrop has a GUI and fairdrop does not (but it's in progress).
- fairdrop only works on devices connected on the same network, but Airdrop can communicate as long as both devices have Bluetooth and a Wi-Fi connection using [AWDL](https://owlink.org/wiki/#what-is-apple-wireless-direct-link-awdl).

## Requirements
Requires Node >= 8.
Dependencies include: [promise-socket](https://www.npmjs.com/package/promise-socket) and [prompt-sync](https://www.npmjs.com/package/prompt-sync).

## Setup
Clone this repo. After cloning, run `npm i` in the main directory to install the dependencies.

*Note:* It includes `dog.jpg` which is the default file that will be transmitted between machines. T

## Usage
fairdrop has two main files, `client.js` and `server.js`, which are used to send and receive files respectively. A single machine can be used as both the sender and receive to send a file to itself for testing purpose.

1. Run `node server.js` on the receiving device to listen for any incoming data/requests.
2. Run `node client.js` on the sending device. It will automatically search your local network for devices that are running a fairdrop server.
3. Enter the number associated with the chosen receiver device. `client.js` has been hardcoded to send `dog.jpg` to the receiver by default. This can be modified on line 105 of `client.js`.
4. In the root directory of the receiver, there will now be a `received_dog.jpg`and the sender will close connection. To use with files other than `dog.jpg`, line 32 of `server.js` must be updated.

## To Do List

 - [ ] Allow users to choose the file to be sent.
 - [ ] Better documentation.
 - Develop a GUI.
	 - [ ] Mobile app
	 - [ ] Desktop app
- [ ] Clean up data handlers.
- Include more information in file transfer.
	- [ ] File name
	- [ ] File type
	- [ ] File size (in bytes)
- [ ] Send multiple files.
- [ ] Consistent file type when receiving/sending.
- [ ] User can set permissions on who to receive files from.
