import * as fs from 'fs';

require('dotenv').config();

import { constants, ethers } from 'ethers';
import { marketsResolver } from './resolvers/markets';
import { MyWsProvider } from './ws-provider';
import { expressApp } from './back/createBack';
import { FakeWs } from './utils/face-socket';
import { Market, syncAllTables } from './pg/models';
import { readJSONFilesFromDirectory } from './utils/readJSONFilesFromDirectory';
import { createModelFromTypes } from './pg/createModelFromSolidityTypes';
import { Model } from 'sequelize/types/model';
import { parseEventArgs } from './utils/parseLogDataLayout';
import { resolveLog } from './resolvers/resolver';
import { startupRestApp } from './back/createBack';

const networks = require('./networks.json');

const CREATE_MARKETPLACE_EVENT = 'NewMarketplace(address,address,address[],uint8)';
const EVENT_CREATE_TOPIC = ethers.utils.id(CREATE_MARKETPLACE_EVENT);

function groupItemBy(array, property) {
  const hash = {},
    props = property.split('.');
  for (let i = 0; i < array.length; i++) {
    const key = props.reduce(function (acc, prop) {
      return acc && acc[prop];
    }, array[i]);
    if (!hash[key]) hash[key] = [];
    hash[key].push(array[i]);
  }
  return hash;
}

function parseCreateMarketplaceEvent(logData: string): {
  market: string;
  nftCollection: string;
  currencies: string[];
  authorRoyalty: number;
} {
  const parsedLogData = ethers.utils.defaultAbiCoder.decode(
    ['address', 'address', 'address[]', 'uint8 '],
    logData,
  );
  return {
    market: parsedLogData[0],
    nftCollection: parsedLogData[1],
    currencies: parsedLogData[2],
    authorRoyalty: parsedLogData[3],
  };
}

export type Config = {
  addresses: string[];
  event: string;
  fieldNames: string[];
  actions: [
    {
      name: string;
    },
  ];
  modelConfig: {
    name: string;
    primaryKeyIndex: number;
  };
  model: any;
  parsedArgs: string[];
};

(async function () {
  await syncAllTables(!!process.env.CLEAN_DB);

  expressApp.listen(process.env.WS_PORT, () =>
    console.log('fake websockets started on http://localhost:8500/ws/$PATH'),
  );

  const configs: Config[] = readJSONFilesFromDirectory('./src/events');
  configs.forEach(c => {
    c.addresses = c.addresses.map(i => ethers.utils.getAddress(i));
  });
  const groupedConfigs = groupItemBy(configs, 'modelConfig.name');

  const mappedConfigs = (
    await Promise.all(
      Object.keys(groupedConfigs).map(key =>
        Promise.all(
          groupedConfigs[key].map(async config => {
            config.parsedArgs = parseEventArgs(config.event);
            if (config.modelConfig) {
              config.model = await createModelFromTypes(
                config.fieldNames,
                config.parsedArgs,
                key,
                config.primaryKeyIndex,
              );
            }
            return config;
          }),
        ),
      ),
    )
  ).flat();

  // const mappedConfigs = await Promise.all(
  //   Object.keys(groupedConfigs).map(key => {
  //     const configWithMostFieldNames = groupedConfigs[key].reduce(
  //       (maxI, el, i, arr) => (el.fieldNames.length > arr[maxI].fieldNames.length ? i : maxI),
  //       0,
  //     );
  //     const model = await createModelFromTypes(
  //         configWithMostFieldNames.fieldNames,
  //         configWithMostFieldNames.parsedArgs,
  //         key,
  //         configWithMostFieldNames.primaryKeyIndex,
  //     );
  //
  //     config.parsedArgs = parseEventArgs(config.event);
  //   }),
  // );
  // console.log('a');

  networks.forEach(network => {
    let wsProvider;
    if (network.fake) {
      new FakeWs(expressApp, network.rpc, network.name, network.fake.interval);
      wsProvider = new MyWsProvider(`ws://localhost:${process.env.WS_PORT}/ws/${network.name}`);
    } else {
      wsProvider = new MyWsProvider(network.socket);
    }
    const jsonProvider = new ethers.providers.JsonRpcProvider(network.rpc);
    const originalBlockFormatter = jsonProvider.formatter._block;
    jsonProvider.formatter._block = (value, format) => {
      return originalBlockFormatter(
        {
          gasLimit: constants.Zero,
          ...value,
        },
        format,
      );
    };

    startupRestApp(network.restApp.port, mappedConfigs, {
      CALL_HELPER: process.env.CALL_HELPER,
      jsonProvider,
    });

    wsProvider.on('block', async block => {
      console.log(`${network.name}:${block}`);

      try {
        const allLogs = await jsonProvider.getLogs({
          fromBlock: block,
          toBlock: block,
        });

        mappedConfigs.forEach(config => {
          resolveLog(allLogs, config as any, mappedConfigs);
        });

        // if (allLogs.length) {
        //   //
        //   const logs = allLogs.filter(
        //     i => i.topics.includes(EVENT_CREATE_TOPIC) && i.address === process.env.FACTORY,
        //   );
        //   await Promise.all(
        //     logs.map(async l => {
        //       const { market, nftCollection, currencies, authorRoyalty } =
        //         parseCreateMarketplaceEvent(l.data);
        //
        //       await Market.create({
        //         address: market,
        //         nftCollection,
        //         currencies,
        //         authorRoyalty,
        //         chainId: network.chainId,
        //       }).catch(e => {
        //         console.log('Something went wrong when saving market', e);
        //       });
        //     }),
        //   );
        // }
      } catch (e) {
        console.error(e);
      }
    });
  });
})();
