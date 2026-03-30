import * as Y from "@y/y";
import { WebsocketProvider } from "y-websocket";

const doc = new Y.Doc();
const wsProvider = new WebsocketProvider("ws://localhost:1234", "my-doc", doc);

wsProvider.on("status", (event) => {
  console.log(event.status); // logs "connected" or "disconnected"
});
