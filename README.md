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

*Note:* This repo includes a `sample_files` directory of three files that can be sent for testing purposes.

## Usage
fairdrop has two main files, `client.js` and `server.js`, which are used to send and receive files respectively. A single machine can be used as both the sender and receive to send a file to itself for testing purpose.

1. Run `node server.js` on the receiving device to listen for any incoming data/requests.
2. Run `node client.js` on the sending device. It will prompt you to drag the file you wish to be sent into the terminal. You can also enter the path to the file from the root folder.
3. After selecting a file, the client will search for any devices on the network that are eligible to receive files and display them in a numbered list. Enter the number associated with the chosen receiver device.
4. Once the file transfer is complete, the file will be in the root directory of the project, `/fairdrop`,

## To Do List

 - [x] Allow users to choose the file to be sent.
 - [ ] Better documentation.
 - Develop a GUI.
	 - [ ] Mobile app
	 - [ ] Desktop app
- [x] Clean up data handlers.
- Include more information in file transfer.
	- [x] File name
	- [x] File type
	- [ ] File size (in bytes)
- [ ] Send multiple files.
- [x] Consistent file type when receiving/sending.
- [ ] User can set permissions on who to receive files from.
