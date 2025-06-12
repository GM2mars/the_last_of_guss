import type WebSocket from 'ws';

import { WsEvents } from '@/controllers/WsController';

export class WsService {
  private ws: WebSocket = null;
  private callbacks = new Map<string, Function>();

  constructor(ws: WebSocket) {
    this.ws = ws;

    this.iniLisiners();
  }

  on(event: string, callback: (payload: { action: string, data?: any }) => void) {
    this.callbacks.set(event, callback);
  }

  off(event: string) {
    this.callbacks.delete(event);
  }

  private iniLisiners() {
    this.ws.on('message', (message: Buffer) => {
      const { event, payload } = JSON.parse(message.toString()) || {};

      if (event === WsEvents.Ping) {
        this.send(WsEvents.Pong);
        return;
      }

      this.callbacks.has(event) && this.callbacks.get(event)(payload);
    });
  }

  send(event: string, payload?: { action: string, data?: any }) {
    this.ws.send(JSON.stringify({ event, payload }));
  }

  close() {
    this.ws.close();
  }
}