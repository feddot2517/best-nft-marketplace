require('dotenv').config();
require('@openzeppelin/hardhat-upgrades');
require('@nomicfoundation/hardhat-toolbox');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        compilers: [
            {
                version: '0.8.0',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 99999,
                    },
                },
            }, {
                version: '0.8.1',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 99999,
                    },
                },
            }, {
                version: '0.8.2',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 99999,
                    },
                },
            },
        ],
    },
    networks: {
        tmy: {
            url: 'https://node1.tmyblockchain.org/rpc',
            accounts: [process.env.PRIVATE_KEY],
            gas: 0x903624,
            gasPrice: 0x3b9aca00,
        },
        bsc: {
            url: 'https://bsc-dataseed.binance.org/',
            chainId: 56,
            gasPrice: 5000000000,
            accounts: [process.env.PRIVATE_KEY],
        },
        ftm: {
            url: 'https://rpc.fantom.network',
            chainId: 250,
            gasPrice: 34000000000, // 34 GWEI
            accounts: [process.env.PRIVATE_KEY],
        },
        bttc: {
            url: 'https://rpc.bittorrentchain.io',
            chainId: 199,
            gasPrice: 300000000000000, // 34 GWEI
            accounts: [process.env.PRIVATE_KEY],
        },
        avax: {
            url: 'https://api.avax.network/ext/bc/C/rpc',
            chainId: 43114,
            gasPrice: 26500000000, // 26.5 GWEI
            accounts: [process.env.PRIVATE_KEY],
        },
        matic: {
            url: 'https://polygon-rpc.com',
            chainId: 137,
            gasPrice: 300000000000, // 26.5 GWEI
            accounts: [process.env.PRIVATE_KEY],
        },
    },
};
