import Tabellone from "./Tabellone.js";

export default class TabelloneNode extends Tabellone {
  constructor(numbers = null) {
    super(numbers || Tabellone.generate());
  }

  render(parent) {
    if (!(parent instanceof HTMLElement)) {
      return;
    }
    parent.innerHTML = "";
    for (const cell of this.numbers) {
      const cellElem = document.createElement("div");
      parent.appendChild(cellElem);
      cellElem.innerText = cell.number;
      if (cell.isMarked) {
        cellElem.className = "marked";
      }
    }
  }
}
