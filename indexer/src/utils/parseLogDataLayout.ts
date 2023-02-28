import { ethers } from 'ethers';
import { Config } from '../main';

export const eventArgRegexp = /[a-zA-Z]+\(([^)]+)\)/;

export function parseEventArgs(event) {
  return eventArgRegexp.exec(event)[1].split(',');
}

export function parseLogDataLayout(logData, config: Config) {
  const parsedLogData = ethers.utils.defaultAbiCoder.decode(config.parsedArgs, logData); // array of parsed data

  const obj = {};

  config.fieldNames.forEach((fieldName, index) => {
    obj[fieldName] = parsedLogData[index];
  });

  return obj;
}
