import { WebSocketServer } from "ws";
import Tombola from "./Tombola.js";
import * as PKT from "./packet.js"

export default class TombolaServer {
  #wsServer;
  #clients;
  #tombola;
  #hasStarted;

  constructor() {
    this.#wsServer = null;
    this.#clients = new Map();
    this.#tombola = new Tombola();
    this.#hasStarted = false;
  }

  #send(ws, pkt) {
    ws.send(JSON.stringify(pkt));
  }

  #reset() {
    for (const key of this.#clients.keys()) {
      this.#clients.set(key, null);
    }
    this.#tombola.reset();
    this.#hasStarted = false;
  }

  #handleJoin(ws, schedineCnt) {
    if (this.#clients.get(ws) || schedineCnt < 1) {
      this.#send(ws, PKT.buildInvalid());
      return;
    }
    if (this.#hasStarted) {
      this.#send(ws, PKT.buildRefuse());
      return;
    }
    const player = this.#tombola.joinPlayer(schedineCnt);
    this.#clients.set(ws, player);
    this.#send(ws, PKT.buildAccept());
  }

  #handleReady(ws) {
    const player = this.#clients.get(ws);
    if (!player) {
      this.#send(ws, PKT.buildInvalid());
      return;
    }
    player.isReady = true;
    const joinedClients = [...this.#clients.values()].filter((p) => p !== null);
    if (joinedClients.length < 2) {
      return;
    }
    const areAllReady = !joinedClients.some((p) => !p.isReady);
    if (areAllReady) {
      this.#hasStarted = true;
      this.#doExtraction();
    }
  }

  #handleConnection = (ws) => {
    this.#clients.set(ws, null);
    ws.on("message", (data) => this.#handleMessage(ws, data));
    ws.on("close", () => this.#handleClose(ws));
    console.log("Client connected");
  }

  #handleMessage(ws, data) {
    data = data.toString();
    const pkt = PKT.parse(data);
    switch (pkt?.type) {
      case PKT.TYPE.JOIN: {
        this.#handleJoin(ws, pkt.schedineCount);
        break;
      }
      case PKT.TYPE.READY: {
        this.#handleReady(ws);
        break;
      }
      default: {
        this.#send(ws, PKT.buildInvalid());
        break;
      }
    }
  }

  #handleClose(ws) {
    this.#clients.delete(ws);
    if ([...this.#clients.values()].filter((p) => p).length === 0) {
      this.#reset();
    }
    console.log("Client disconnected");
  }

  #doExtraction() {
    const [extractedNum, curPartialWin] = this.#tombola.extract();
    for (const [ws, player] of this.#clients.entries()) {
      if (!player) {
        return;
      }
      this.#send(ws, PKT.buildState(
        extractedNum,
        this.#tombola.tabellone.numbers,
        player.numbers,
        curPartialWin
      ));
    }
    [...this.#clients.values()].forEach((p) => p.isReady = false);
    if (curPartialWin > Tombola.TOMBOLA) {
      this.#reset();
    }
  }

  listen(port) {
    this.#wsServer = new WebSocketServer({ port: port });
    this.#wsServer.on("connection", this.#handleConnection);
  }
}
