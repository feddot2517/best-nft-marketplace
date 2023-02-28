import { providers } from 'ethers';
import { randomString } from './randomString';

export class NeonWs {
  provider: providers.JsonRpcProvider;
  currentBlock: number;
  subs: Array<{
    id;
    ws: { on: Function; send: Function };
    type: 'newHeads';
  }> = [];

  constructor(app, rpc) {
    this.provider = new providers.JsonRpcProvider(rpc);

    app.ws(`/ws/neon`, async ws => {
      const id = randomString(10);

      ws.on('message', d => {
        try {
          const data = JSON.parse(d);
          if (data.method === 'eth_subscribe') {
            this.subs.push({ id, ws, type: data.params[0] });
            ws.send(
              JSON.stringify({
                result: id,
                jsonrpc: '2.0',
                method: 'eth_subscription',
                id: data.id,
              }),
            );
          }
        } catch (e) {
          console.log(e);
        }
      });

      ws.on('close', () => {
        const index = this.subs.findIndex(i => i.id === id);
        this.subs.splice(index, 1);
      });
    });

    this.init();
  }

  init() {
    setInterval(async () => {
      try {
        if (this.subs.length) {
          const blockNumber = await this.provider.getBlockNumber().catch(e => console.log(e));
          if (blockNumber && blockNumber !== this.currentBlock) {
            this.subs.forEach(sub => {
              sub.ws.send(
                JSON.stringify({
                  jsonrpc: '2.0',
                  method: 'eth_subscription',
                  params: {
                    subscription: sub.id,
                    result: { number: blockNumber },
                  },
                }),
              );
            });
            this.currentBlock = blockNumber;
          }
        }
      } catch (e) {
        console.log(e);
      }
    }, 350);
  }
}
