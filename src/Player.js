import Schedina from "./Schedina.js";

export default class Player {
  #id;
  #schedine;
  #isReady;

  static #idCount = 0;

  constructor(schedineCnt = 1) {
    this.#id = Player.#idCount++;
    this.#schedine = this.#initSchedine(schedineCnt);
    this.#isReady = false;
  }

  get id() {
    return this.#id;
  }

  get schedine() {
    return this.#schedine;
  }

  get isReady() {
    return this.#isReady;
  }

  set isReady(isReady) {
    this.#isReady = Boolean(isReady);
  }

  get numbers() {
    return this.#schedine.map((s) => s.numbers);
  }

  #initSchedine(schedineCnt) {
    return [...Array(parseInt(schedineCnt))].map((_v, i) => new Schedina(i));
  }

  generateSchedine() {
    for (const schedina of this.#schedine) {
      schedina.generate();
    }
  }

  checkAndMarkNumber(number) {
    let isFound = false;
    for (const schedina of this.#schedine) {
      const a = schedina.checkAndMarkNumber(number);
      isFound = isFound || a;
    }
    return isFound;
  }

  checkNumbers(count) {
    for (const schedina of this.#schedine) {
      if (schedina.checkNumbersOnAllRows(count)) {
        return true;
      }
    }
    return false;
  }

  checkTombola() {
    for (const schedina of this.#schedine) {
      if (schedina.checkTombola()) {
        return true;
      }
    }
    return false;
  }
}
