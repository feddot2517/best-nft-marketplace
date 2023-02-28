import { ethers } from 'ethers';
import { Model as M, ModelCtor } from 'sequelize/types/model';

require('dotenv').config();
const express = require('express');
const app = express();
const wsInstance = require('express-ws')(app);
const bodyParser = require('body-parser');

const restApp = express();

const TRANSFER_NFT_TOPIC = ethers.utils.id('Transfer(address,address,uint256)');

const findConfig = (rootConfig, id) => rootConfig.find(c => c.id === id);

type Model = ModelCtor<M<any, any>>;

export const startupRestApp = (
  port,
  root,
  {
    CALL_HELPER,
    jsonProvider,
  }: { jsonProvider: ethers.providers.JsonRpcProvider; CALL_HELPER: string },
) => {
  const callHelperAbi = require('../abi/CallHelper.abi.json');

  restApp.use(express.json());
  restApp.use(bodyParser.urlencoded({ extended: true }));
  restApp.use(cors);

  restApp.get('/api/offers', async (req, res) => {
    const { limit, collection, from, to, state } = req.query;

    res.send();
  });

  restApp.get('/api/collections', async (req, res) => {
    const { limit, offset } = req.query;
    const config = findConfig(root, 'NewMarketplace.id');

    const model: Model = config.model;
    const collections = await model.findAll({
      attributes: ['nftCollection'],
      limit,
      raw: true,
    });

    const callHelperContract = new ethers.Contract(CALL_HELPER, callHelperAbi, jsonProvider);

    const map = collections.map((i: any) => i.nftCollection);
    const collectionInfos = await callHelperContract.collectionInfos(map.concat(map).concat(map));
    const mappedCollectionInfos = collectionInfos.map((i, index) => ({
      name: i.name,
      symbol: i.symbol,
      address: map[index],
    }));

    res.send(mappedCollectionInfos);
  });

  restApp.get('/api/collection/:address', async (req, res) => {
    const { address } = req.params;
    if (!ethers.utils.isAddress(address)) {
      return res.status(404).send('wrong address');
    }

    const addressLogs = await jsonProvider.getLogs({
      address,
      topics: [TRANSFER_NFT_TOPIC],
      fromBlock: 3583872,
    });

    res.send(addressLogs);
  });

  //My offers route

  //My collections

  restApp.listen(port, () => console.log('rest server started on 8000'));
};

function cors(req: any, res: any, next: any) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Expose-Headers', 'Content-Length');
  res.header(
    'Access-Control-Allow-Headers',
    'Accept, Authorization, Content-Type, X-Requested-With, Range, Referer, User-Agent, Origin',
  );
  next();
}

export const expressApp = app;
