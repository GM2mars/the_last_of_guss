import { WsStatus } from "@/interfaces/interfaces";

const API_WS = import.meta.env.VITE_API_WS;


export class Websocket extends EventTarget {
  ws: WebSocket = null;
  status: WsStatus = WsStatus.Offline;

  private static instance: Websocket;

  public static getInstance(): Websocket {
    if (!Websocket.instance) {
      Websocket.instance = new Websocket();
    }

    return Websocket.instance;
  }

  constructor() {
    super();
  };

  close = () => {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.status = WsStatus.Offline;
    }
  };

  connect = async () => {
    if (this.status === WsStatus.Connected || this.status === WsStatus.Connecting) return;

    const ws = new WebSocket(`${API_WS}/ws`);

    this.status = WsStatus.Connecting;
    this.ws = ws;

    ws.onopen = () => this.onOpen();
    ws.onmessage = (event) => this.onMessage(event);
    ws.onerror = (error) => this.onError(error);
    ws.onclose = () => this.onClose();
  };

  sendMessage = (event, payload?: { action: string, data?: any }) => {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    this.ws.send(JSON.stringify({ event, payload }));
  };

  getStatus = () => this.status;

  private pingPong = () => {
    this.sendMessage("ping");
    setTimeout(this.pingPong, 30000);
  };

  private newEvent = (name: string, payload?: any) => {
    const evt = new CustomEvent<any>(name, { detail: payload });
    this.dispatchEvent(evt);
  };

  private onMessage = (event: any) => {
    const data = JSON.parse(event.data);

    if (data.event === "pong") return;

    this.newEvent(data.event, data?.payload);
  };

  private onError = (error: any) => {
    console.log("ws error:", error);
    this.status = WsStatus.Error;
    this.newEvent(WsStatus.Error);
  };

  private onOpen = () => {
    console.log("ws connected");
    this.status = WsStatus.Connected;
    this.newEvent(WsStatus.Connected);

    this.pingPong();
  };

  private onClose = () => {
    console.log("ws disconnected");
    this.status = WsStatus.Disconnected;
    this.newEvent(WsStatus.Disconnected);
  };
};