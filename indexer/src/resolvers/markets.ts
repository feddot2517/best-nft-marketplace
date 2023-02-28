import { ethers, Transaction } from 'ethers';
import { Opt } from '../types';

const METHOD = 'createMarketplace(address,address[],uint8)';

const methodSig = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(METHOD)).slice(0, 10)

export const marketsResolver = (tx: Transaction, opt: Opt) => {
    const txMethod = tx.data.slice(0, 10);
    if (txMethod == METHOD) {

    }
};
