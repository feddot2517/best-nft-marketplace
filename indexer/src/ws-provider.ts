import { providers } from 'ethers';
import { Networkish } from '@ethersproject/networks';
import { defineReadOnly } from 'ethers/lib/utils';

export class MyWsProvider extends providers.WebSocketProvider {
  constructor(url: string | any, network?: Networkish) {
    super(url, network);

    this.websocket.onmessage = (messageEvent: { data: string }) => {
      const data = messageEvent.data;
      const result = JSON.parse(data);
      if (result.id != null) {
        const id = String(result.id);
        const request = this._requests[id];
        delete this._requests[id];

        if (result.result !== undefined) {
          request.callback(null, result.result);

          this.emit('debug', {
            action: 'response',
            request: JSON.parse(request.payload),
            response: result.result,
            provider: this,
          });
        } else {
          let error: Error = null;
          if (result.error) {
            error = new Error(result.error.message || 'unknown error');
            defineReadOnly(<any>error, 'code', result.error.code || null);
            defineReadOnly(<any>error, 'response', data);
          } else {
            error = new Error('unknown error');
          }

          request.callback(error, undefined);

          this.emit('debug', {
            action: 'response',
            error: error,
            request: JSON.parse(request.payload),
            provider: this,
          });
        }
      } else if (result.method === 'eth_subscription' || result.method === 'EvmBlockHeader') {
        // Subscription...
        const sub = this._subs[result.params.subscription];
        if (sub) {
          //this.emit.apply(this,                  );
          sub.processFunc(result.params.result);
        }
      } else {
        console.warn('this should not happen');
      }
    };
  }
}
