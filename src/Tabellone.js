export default class Tabellone {
  #numbers;

  constructor(numbers = null) {
    this.numbers = numbers || Tabellone.generate();
  }

  get numbers() {
    return this.#numbers;
  }

  set numbers(numbers) {
    this.#numbers = Tabellone.#validate(numbers)
      ? numbers
      : Tabellone.generate();
  }

  static #validate(values) {
    return (values instanceof Array && values.length === 90);
  }

  static #buildCell(number) {
    return {
      number: parseInt(number),
      isMarked: false
    };
  }

  static generate() {
    const numbers = [];
    for (let i = 1; i <= 90; i++) {
      numbers.push(Tabellone.#buildCell(i));
    }
    return numbers;
  }

  markNumber(number) {
    const cell = this.#numbers.find((cell) => cell.number === number);
    if (!cell) {
      return;
    }
    cell.isMarked = true;
  }

  checkNumbersOnRowByFive(rowIndex, count) {
    if (rowIndex < 0 || rowIndex > 18) {
      return false;
    }
    const offset = rowIndex * 5;
    let cnt = 0;
    for (let i = offset; i < offset + 5; i++) {
      const cell = this.#numbers[i];
      if (cell.isMarked) {
        cnt++;
      }
    }
    return cnt >= count;
  }

  checkNumbersOnAllRows(count) {
    for (let i = 0; i < 18; i++) {
      if (this.checkNumbersOnRowByFive(i, count)) {
        return true;
      }
    }
    return false;
  }

  checkTombola(fieldIndex) {
    let rowIndex = fieldIndex * 3 + (fieldIndex % 2 === 0 ? 0 : 1)
    for (let i = 0; i < 3; i++) {
      if (!this.checkNumbersOnRowByFive(rowIndex, 5)) {
        return false;
      }
      rowIndex += 2;
    }
    return true;
  }

  checkAllTombola() {
    for (let i = 0; i < 6; i++) {
      if (this.checkTombola(i)) {
        return true;
      }
    }
    return false;
  }
}
