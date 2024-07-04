// src/components/NFTCreator.js

import React, { useState } from 'react';
import { ethers } from 'ethers';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { Buffer } from 'buffer';
window.Buffer = Buffer;

const projectId = '2b4de27dea3e4a759f3fb7040d430364'; // Replace with your Infura project ID
const projectSecret = 'xIX03WrcDTAsbVZTCl+fNmjZC6vNSMIIcnOQto4+bF0R4cL+ZcOTuw'; // Replace with your Infura project secret
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

console.log('Auth Header:', auth);

const ipfs = ipfsHttpClient({
	host: 'ipfs.infura.io',
	port: 5001,
	protocol: 'https',
	headers: {
		authorization: auth,
	},
});

// const ipfs = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const NFTFactoryAddress = "0xbac9dec2f730bcbb397e7445cce2ac070b74ba18";
const NFTFactoryABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "symbol",
				"type": "string"
			}
		],
		"name": "createNFTCollection",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "collectionAddress",
				"type": "address"
			}
		],
		"name": "NFTCollectionCreated",
		"type": "event"
	}
]

const UserNFTABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "symbol",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "initialOwner",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721IncorrectOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721InsufficientApproval",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC721InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOperator",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC721InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC721InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721NonexistentToken",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_fromTokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_toTokenId",
				"type": "uint256"
			}
		],
		"name": "BatchMetadataUpdate",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "MetadataUpdate",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "tokenURI",
				"type": "string"
			}
		],
		"name": "mintNFT",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "tokenCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]


const NFTCreator = ({ state }) => {
	const [option, setOption] = useState('create'); // 'create' or 'mint'
	const [collectionName, setCollectionName] = useState('');
	const [collectionSymbol, setCollectionSymbol] = useState('');
	const [selectedFile, setSelectedFile] = useState(null);
	const [tokenDescription, setTokenDescription] = useState('');
	const [collectionAddress, setCollectionAddress] = useState('');
	const [newCollectionAddress, setNewCollectionAddress] = useState(null);
	const [mintedTokenAddress, setMintedTokenAddress] = useState(null);

	const handleFileChange = (event) => {
		setSelectedFile(event.target.files[0]);
	};

	const uploadToIPFS = async (file) => {
		try {
			console.log('Uploading to IPFS...');  // Add this to check if upload starts
			const added = await ipfs.add(file);
			const url = `https://ipfs.infura.io/ipfs/${added.path}`;
			return url;
		} catch (error) {
			console.error('Error uploading file to IPFS:', error);
			return null;
		}
	};

	const createNFTCollection = async () => {
		if (!collectionName || !collectionSymbol) return;

		const nftFactoryContract = new ethers.Contract(NFTFactoryAddress, NFTFactoryABI, state.signer);

		// Set the event listener before performing the transaction
		nftFactoryContract.on("NFTCollectionCreated", (owner, collectionAddress, event) => {
			console.log(`NFTCollectionCreated event: Owner - ${owner}, Collection Address - ${collectionAddress}`);

			// Optionally, stop listening after first event is caught
			event.removeListener();

			// Set the new collection address in your state
			setNewCollectionAddress(collectionAddress);
			alert('NFT Collection created successfully!');
		});

		try {
			const tx = await nftFactoryContract.createNFTCollection(collectionName, collectionSymbol);
			const receipt = await tx.wait();
			console.log('Transaction Receipt:', receipt);
		} catch (error) {
			console.error('Error creating NFT collection:', error);
		}
	};

	const mintNFT = async () => {
		if (!selectedFile || !tokenDescription || !collectionAddress) return;

		const imageUrl = await uploadToIPFS(selectedFile);
		if (!imageUrl) return;

		const metadata = {
			image: imageUrl,
			description: tokenDescription,
			attributes: []  // This can be updated to include specific attributes if needed
		};

		try {
			const added = await ipfs.add(JSON.stringify(metadata));
			const tokenURI = `https://ipfs.infura.io/ipfs/${added.path}`;

			const userNFTContract = new ethers.Contract(collectionAddress, UserNFTABI, state.signer);

			const tx = await userNFTContract.mintNFT(await state.signer.getAddress(), tokenURI);
			const receipt = await tx.wait();
			const tokenId = receipt.events.find(event => event.event === 'Transfer').args.tokenId;

			setMintedTokenAddress(tokenId);
			alert('NFT minted successfully!');
		} catch (error) {
			console.error('Error minting NFT:', error);
		}
	};

	return (
		<div>
			<h1>NFT Creator</h1>
			<div>
				<button onClick={() => setOption('create')}>Create NFT Collection</button>
				<button onClick={() => setOption('mint')}>Mint NFT</button>
			</div>

			{option === 'create' && (
				<div>
					<h2>Create NFT Collection</h2>
					<input
						type="text"
						placeholder="Collection Name"
						value={collectionName}
						onChange={(e) => setCollectionName(e.target.value)}
					/>
					<input
						type="text"
						placeholder="Collection Symbol"
						value={collectionSymbol}
						onChange={(e) => setCollectionSymbol(e.target.value)}
					/>
					<button onClick={createNFTCollection}>Create Collection</button>

					{newCollectionAddress && (
						<div>
							<p>New Collection Address: {newCollectionAddress}</p>
							<h2>Mint NFT for New Collection</h2>
							<input type="file" onChange={handleFileChange} />
							<input
								type="text"
								placeholder="NFT Description"
								value={tokenDescription}
								onChange={(e) => setTokenDescription(e.target.value)}
							/>
							<button onClick={mintNFT}>Mint NFT</button>
						</div>
					)}
				</div>
			)}

			{option === 'mint' && (
				<div>
					<h2>Mint NFT</h2>
					<input
						type="text"
						placeholder="Existing Collection Address"
						value={collectionAddress}
						onChange={(e) => setCollectionAddress(e.target.value)}
					/>
					<input type="file" onChange={handleFileChange} />
					<input
						type="text"
						placeholder="NFT Description"
						value={tokenDescription}
						onChange={(e) => setTokenDescription(e.target.value)}
					/>
					<button onClick={() => mintNFT(collectionAddress)}>Mint NFT</button>

					{mintedTokenAddress && (
						<div>
							<p>Minted Token ID: {mintedTokenAddress}</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default NFTCreator;
