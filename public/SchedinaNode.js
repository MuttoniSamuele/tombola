import Schedina from "./Schedina.js";

export default class SchedinaNode extends Schedina {
  constructor(id, numbers = null) {
    super(id, numbers);
  }

  render(parent) {
    if (!(parent instanceof HTMLElement)) {
      return;
    }
    parent.innerHTML = "";
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 9; x++) {
        const cell = this.numbers[x][y];
        const cellElem = document.createElement("div");
        parent.appendChild(cellElem);
        if (!cell) {
          continue;
        }
        cellElem.innerText = cell.number;
        if (cell.isMarked) {
          cellElem.className = "marked";
        }
      }  
    }
  }
}
