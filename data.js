const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

var nodes = [];

function draw(data) {
  context.beginPath();
  context.moveTo(data.lastPoint.x, data.lastPoint.y);
  context.lineTo(data.x, data.y);
  context.strokeStyle = data.color;
  context.lineWidth = Math.pow(data.force || 1, 4) * 2;
  context.lineCap = "round";
  context.stroke();
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // draw();
}

window.onresize = resize;
resize();

const wsConnection = new WebSocket("ws:127.0.0.1:8081", "json");
wsConnection.onopen = (e) => {
  console.log(`wsConnection open to 127.0.0.1:8081`, e);
};
wsConnection.onerror = (e) => {
  console.error(`wsConnection error `, e);
};
wsConnection.onmessage = (e) => {
  console.log(JSON.parse(e.data));

  wsConnection.send(JSON.stringify({ type: "test", msg: "hello world" }));
};
var localId, peerIds;
var peerConnections = {};
var initiator = false;

wsConnection.onmessage = (e) => {
  let data = JSON.parse(e.data);
  switch (data.type) {
    case "connection":
      localId = data.id;
      break;
    case "ids":
      peerIds = data.ids;
      connect();
      break;
    case "signal":
      signal(data.id, data.data);
      break;
  }
};

function connect() {
  // cleanup peer connections not in peer ids
  Object.keys(peerConnections).forEach((id) => {
    if (!peerIds.includes(id)) {
      peerConnections[id].destroy();
      delete peerConnections[id];
    }
  });
  if (peerIds.length === 1) {
    initiator = true;
  }
  peerIds.forEach((id) => {
    if (id === localId || peerConnections[id]) {
      return;
    }

    let peer = new SimplePeer({
      initiator: initiator,
    });
    peer.on("error", console.error);
    peer.on("signal", (data) => {
      wsConnection.send(
        JSON.stringify({
          type: "signal",
          id: localId,
          data,
        })
      );
    });
    peer.on("data", (data) => onPeerData(id, data));
    peerConnections[id] = peer;
  });
}

function signal(id, data) {
  if (peerConnections[id]) {
    peerConnections[id].signal(data);
  }
}

function broadcast(data) {
  Object.values(peerConnections).forEach((peer) => {
    peer.send(data);
  });
}

function onPeerData(id, data) {
  draw(JSON.parse(data));
}

function move(e) {
  if (e.buttons) {
    if (!lastPoint) {
      lastPoint = { x: e.offsetX, y: e.offsetY };
      return;
    }

    draw({
      lastPoint,
      x: e.offsetX,
      y: e.offsetY,
      force: force,
      color: color || "green",
    });

    broadcast(
      JSON.stringify({
        lastPoint,
        x: e.offsetX,
        y: e.offsetY,
        color: color || "green",
        force: force,
      })
    );

    lastPoint = { x: e.offsetX, y: e.offsetY };
  }
}
