import { WebSocketServer } from "ws";
import { setupWSConnection } from "y-websocket/bin/utils";

const wss = new WebSocketServer({ port: 1234 });

wss.on("connection", (ws, req) => {
  setupWSConnection(ws, req, { gc: true });
});

console.log("WebSocket server running on ws://localhost:1234");
