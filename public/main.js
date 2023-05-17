import TombolaClient from "./TombolaClient.js";
import TabelloneNode from "./TabelloneNode.js";
import SchedinaNode from "./SchedinaNode.js";
import Tombola from "./Tombola.js";

const joinDivElem = document.getElementById("join-div");
const gameDivElem = document.getElementById("game-div");
const schedineCntInputElem = document.getElementById("schedine-count-input");
const joinBtnElem = document.getElementById("join-btn");
const tabellonePlaceholderElem = document.getElementById("tabellone-placeholder");
const schedinePlaceholderElem = document.getElementById("schedine-placeholder");
const extractedNumElem = document.getElementById("extracted-num-txt");
const partialWinElem = document.getElementById("partial-win-txt");
const readyBtnElem = document.getElementById("ready-btn");
const loaderElem = document.getElementById("loader");

function partialWinToString(partialWin) {
  switch (partialWin) {
    case Tombola.AMBO: { return "ambo"; }
    case Tombola.TERNA: { return "terna"; }
    case Tombola.QUATERNA: { return "quaterna"; }
    case Tombola.CINQUINA: { return "cinquina"; }
    default: { return "tombola"; }
  }
}


function render(tabelloneNumbers = null, schedinaNumbers = []) {
  (new TabelloneNode(tabelloneNumbers)).render(tabellonePlaceholderElem);
  schedinePlaceholderElem.innerHTML = "";
  schedinaNumbers.forEach((numbers, i) => {
    const schedinaElem = document.createElement("div");
    schedinePlaceholderElem.appendChild(schedinaElem);
    schedinaElem.className = "schedina";
    (new SchedinaNode(i, numbers)).render(schedinaElem);
  });
}


const handleState = (extractedNumber, tabelloneNumbers, playerNumbers, curPartialWin) => {
  render(tabelloneNumbers, playerNumbers);
  extractedNumElem.innerText = extractedNumber;
  partialWinElem.innerText = partialWinToString(curPartialWin);
  loaderElem.classList.add("hidden");
}


function initClient() {
  const client = new TombolaClient();
  client.onAccept = () => {
    joinDivElem.classList.add("hidden");
    gameDivElem.classList.remove("hidden");
    render();
  }
  client.onRefuse = () => {
    alert("The game has already started!");
  }
  client.onEnd = () => {

  }
  client.onState = handleState;
  return client;
}

function setupEvents(client) {
  joinBtnElem.addEventListener("click", () => {
    const schedineCnt = parseInt(schedineCntInputElem.value);
    if (isNaN(schedineCnt) || schedineCnt < 1) {
      return;
    }
    client.join(schedineCnt);
  });
  schedineCntInputElem.addEventListener("keydown", (e) => {
    e.key === "Enter" && joinBtnElem.click()
  });
  readyBtnElem.addEventListener("click", () => {
    client.ready();
  });
}


function main() {
  const client = initClient();
  setupEvents(client);
}
main();
