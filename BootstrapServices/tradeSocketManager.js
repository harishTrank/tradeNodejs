const WebSocket = require("ws");
const { tradeApiKey, webSocketURL } = require("../config/keys");

const myWebSocketServer = new WebSocket.Server({ port: 4000 });

const thirdPartyWebSocket = new WebSocket(webSocketURL);
const authorization = {
  MessageType: "Authenticate",
  Password: tradeApiKey,
};

myWebSocketServer.on("connection", (ws) => {
  console.log("Client connected to myWebSocketServer");
  thirdPartyWebSocket.send(JSON.stringify(authorization));

  ws.on("message", (message) => {
    console.log(`Received message from client: ${message}`);
    thirdPartyWebSocket.send(`${message}`);
  });

  thirdPartyWebSocket.on("message", (message) => {
    console.log(`Received message from third-party server: ${message}`);
    ws.send(`${message}`);
  });

  // Handle disconnections
  ws.on("close", () => {
    console.log("Client disconnected from myWebSocketServer");
    thirdPartyWebSocket.close();
  });
});

// Handle errors
myWebSocketServer.on("error", (error) => {
  console.error(`WebSocket server error: ${error.message}`);
});

// Handle close events
myWebSocketServer.on("close", () => {
  console.log("WebSocket server closed");
});
