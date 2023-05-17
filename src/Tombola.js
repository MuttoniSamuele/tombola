import Tabellone from "./Tabellone.js";
import Player from "./Player.js";
import * as UTILS from "./utils.js";

export default class Tombola {
  #tabellone;
  #players;
  #remainingNums;
  #curPartialWin;

  constructor() {
    this.#init();
  }

  static get AMBO() { return 2; }
  static get TERNA() { return 3; }
  static get QUATERNA() { return 4; }
  static get CINQUINA() { return 5; }
  static get TOMBOLA() { return 6; }

  get tabellone() {
    return this.#tabellone;
  }

  get players() {
    return this.#players;
  }

  get curPartialWin() {
    return this.#curPartialWin;
  }

  #init() {
    this.#tabellone = new Tabellone();
    this.#players = [];
    this.#remainingNums = UTILS.generateSequentialNumbers(1, 90);
    this.#curPartialWin = 2;
  }

  #checkWin() {
    if (this.#curPartialWin < Tombola.TOMBOLA) {
      return (
        this.#tabellone.checkNumbersOnAllRows(this.#curPartialWin) ||
        this.#players.some((p) => p.checkNumbers(this.#curPartialWin))
      );
    } else {
      return (
        this.#tabellone.checkAllTombola() ||
        this.#players.some((p) => p.checkTombola(this.#curPartialWin))
      );
    }
  }

  #handleExtractedNumber(number) {
    this.#tabellone.markNumber(number);
    this.#players.forEach((p) => p.checkAndMarkNumber(number));
    if (this.#checkWin()) {
      this.#curPartialWin++;
    }
  }

  findPlayerById(id) {
    return this.#players.find((p) => p.id === id) || null;
  }

  joinPlayer(schedineCnt) {
    const player = new Player(schedineCnt);
    player.generateSchedine();
    this.#players.push(player);
    return player;
  }

  extract() {
    const rndIndex = Math.floor(Math.random() * this.#remainingNums.length);
    const extractedNum = this.#remainingNums[rndIndex];
    this.#remainingNums.splice(rndIndex, 1);
    this.#handleExtractedNumber(extractedNum);
    return [extractedNum, this.#curPartialWin];
  }

  reset() {
    this.#init();
  }
}
