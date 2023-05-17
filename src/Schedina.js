import * as UTILS from "./utils.js";

export default class Schedina {
  #id;
  #numbers;

  constructor(id, numbers = null) {
    this.id = id;
    this.numbers = numbers;
  }

  get id() {
    return this.#id;
  }

  set id(id) {
    this.#id = parseInt(id);
  }

  get numbers() {
    return this.#numbers;
  }

  set numbers(numbers) {
    this.#numbers = Schedina.#validate(numbers)
      ? numbers
      : Schedina.#generateEmpty();
  }

  static #generateEmpty() {
    return [...Array(9)].map(() => Array(3).fill(null));
  }

  static #validate(values) {
    return (
      values instanceof Array && values.length === 9 &&
      values.some((v) => v instanceof Array && v.length === 3)
    );
  }

  static #buildCell(number) {
    return {
      number: parseInt(number),
      isMarked: false
    };
  }

  static #generateColumn(schedinaNumbers, colIndex) {
    const column = schedinaNumbers[colIndex];
    const min = colIndex * 10;
    let nums;
    if (min === 0) {
      nums = UTILS.generateSequentialNumbers(1, 9);
    } else if (min === 80) {
      nums = UTILS.generateSequentialNumbers(80, 90);
    } else {
      nums = UTILS.generateSequentialNumbers(min, min + 9);
    }
    for (let i = 0; i < column.length; i++) {
      const rndIndex = Math.floor(Math.random() * nums.length);
      column[i] = Schedina.#buildCell(nums[rndIndex]);
      nums.splice(rndIndex, 1);
    }
    column.sort((a, b) => a.number - b.number);
  }

  static #deleteRowNumbers(schedinaNumbers, count) {
    for (let y = 0; y < 3; y++) {
      const nums = UTILS.generateSequentialNumbers(0, 8);
      for (let i = 0; i < count; i++) {
        const rndIndex = Math.floor(Math.random() * nums.length);
        schedinaNumbers[nums[rndIndex]][y] = null;
        nums.splice(rndIndex, 1);
      }
    }
  }

  generate() {
    const numbers = Schedina.#generateEmpty();
    for (let i = 0; i < numbers.length; i++) {
      Schedina.#generateColumn(numbers, i);
    }
    Schedina.#deleteRowNumbers(numbers, 4);
    this.numbers = numbers;
  }

  checkAndMarkNumber(number) {
    if (number === 90) {
      number--;
    }
    if (number <= 0 || number >= 90) {
      return false;
    }
    const column = this.#numbers[Math.floor(number / 10)];
    for (let i = 0; i < column.length; i++) {
      const cell = column[i];
      if (cell && cell.number === number) {
        cell.isMarked = true;
        return true;
      }
    }
    return false;
  }

  checkNumbersOnRow(rowIndex, count) {
    if (rowIndex < 0 || rowIndex > 2) {
      return false;
    }
    let cnt = 0;
    for (const col of this.#numbers) {
      const cell = col[rowIndex];
      if (cell && cell.isMarked) {
        cnt++;
      }
    }
    return cnt >= count;
  }

  checkNumbersOnAllRows(count) {
    for (let i = 0; i < 3; i++) {
      if (this.checkNumbersOnRow(i, count)) {
        return true;
      }
    }
    return false;
  }

  checkTombola() {
    // for (const col of this.#numbers) {
    //   for (const cell of col) {
    //     if (cell && !cell.isMarked) {
    //       return false;
    //     }
    //   }
    // }
    // return true;
    for (let i = 0; i < 3; i++) {
      if (!this.checkNumbersOnRow(i, 5)) {
        return false;
      }
    }
    return true
  }
}
