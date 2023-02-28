import { Log } from '@ethersproject/abstract-provider';
import { ethers } from 'ethers';
import { Model } from 'sequelize/types/model';
import { parseLogDataLayout } from '../utils/parseLogDataLayout';
import { actions } from '../actions';

export function resolveLog(
  logs: Log[],
  config: {
    addresses: string[];
    event: string;
    fieldNames: string[];
    actions: Array<{
      name: string;
      params: string[];
    }>;
    model: Model;
  },
  root,
) {
  const event = config.event;
  const eventTopic = ethers.utils.id(event);

  const targetLogs = logs.filter(
    i => i.topics.includes(eventTopic) && config.addresses.includes(i.address),
  );

  if (!targetLogs.length) return;

  const parsedData = targetLogs.map(l => parseLogDataLayout(l.data, config as any));

  config.actions.forEach(action => {
    parsedData.forEach(pd => {
      actions[action.name](pd, action.params, config, root);
    });
  });
}
