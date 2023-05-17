import { WS_PORT } from "./config.js";
import * as PKT from "./packet.js";
import Tombola from "./Tombola.js";

export default class TombolaClient {
  #ws;

  constructor() {
    this.#ws = new WebSocket(`ws://localhost:${WS_PORT}`);
    this.#ws.addEventListener("message", this.#handleMessage);
    this.#ws.addEventListener("error", this.#handleError);
  }

  onAccept = () => {};
  onRefuse = () => {};
  onState = (_extractedNumber, _tabelloneNumbers, _playerNumbers, _curPartialWin) => {};
  onEnd = () => {};

  #send(pkt) {
    this.#ws.send(JSON.stringify(pkt));
  }

  #handleMessage = (e) => {
    const pkt = PKT.parse(e.data.toString());
    switch (pkt?.type) {
      case PKT.TYPE.ACCEPT: {
        this.onAccept();
        break;
      }
      case PKT.TYPE.REFUSE: {
        this.onRefuse();
        break;
      }
      case PKT.TYPE.STATE: {
        if (pkt.curPartialWin > Tombola.TOMBOLA) {
          this.onEnd();
          break;
        }
        this.onState(
          pkt.extractedNumber,
          pkt.tabelloneNumbers,
          pkt.playerNumbers,
          pkt.curPartialWin
        );
        break;
      }
      case PKT.TYPE.INVALID: {
        console.log("How tf did you get here");
        break;
      }
    }
  }

  #handleError = (e) => {
    console.error(e);
  }

  join(schedineCnt) {
    if (schedineCnt < 1) {
      return;
    }
    this.#send(PKT.buildJoin(schedineCnt));
  }

  ready() {
    this.#send(PKT.buildReady());
  }
}
