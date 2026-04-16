import http from "http";
import { WebSocket } from "ws";
import { setupWSConnection } from "y-websocket/bin/utils.js";

const port = process.env.PORT || 1234;
const server = http.createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Yjs WebSocket Server");
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (conn, req) => {
  // room name is usually derived from the URL path
  setupWSConnection(conn, req);
});

server.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
