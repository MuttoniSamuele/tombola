export const TYPE = {
  JOIN: "join",
  ACCEPT: "accept",
  REFUSE: "refuse",
  READY: "ready",
  STATE: "state",
  INVALID: "invalid"
};


export function buildJoin(schedineCnt) {
  return {
    type: TYPE.JOIN,
    schedineCount: schedineCnt
  };
}

export function buildAccept() {
  return {
    type: TYPE.ACCEPT
  };
}

export function buildRefuse() {
  return {
    type: TYPE.REFUSE
  };
}

export function buildReady() {
  return {
    type: TYPE.READY
  };
}

export function buildState(extractedNum, tabelloneNumbers, playerNumbers, curPartialWin) {
  return {
    type: TYPE.STATE,
    extractedNumber: extractedNum,
    tabelloneNumbers: tabelloneNumbers,
    playerNumbers: playerNumbers,
    curPartialWin: curPartialWin
  };
}

export function buildInvalid() {
  return {
    type: TYPE.INVALID
  };
}


export function parse(data) {
  let pkt;
  try {
    pkt = JSON.parse(data);
  } catch (e) {
    return null;
  }
  if (!pkt) {
    return null;
  }
  switch (pkt.type) {
    case TYPE.JOIN: {
      return buildJoin(pkt.schedineCount);
    }
    case TYPE.ACCEPT: {
      return buildAccept();
    }
    case TYPE.REFUSE: {
      return buildRefuse();
    }
    case TYPE.READY: {
      return buildReady();
    }
    case TYPE.STATE: {
      return buildState(
        pkt.extractedNumber,
        pkt.tabelloneNumbers,
        pkt.playerNumbers,
        pkt.curPartialWin
      );
    }
    case TYPE.INVALID: {
      return buildInvalid();
    }
  }
}
