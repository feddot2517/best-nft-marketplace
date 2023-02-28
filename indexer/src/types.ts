import { ethers } from 'ethers';

export type NetworkData = {
  name: string;
  socket: string;
  rpc: string;
  fake?: {
    interval: number;
  };
};

export type Opt = {
  bot: {
    broadcastMessage: Function;
  };
  jsonProvider: ethers.providers.JsonRpcProvider;
  network: NetworkData;
};
