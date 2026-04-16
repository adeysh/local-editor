import { WebsocketProvider } from "y-websocket";
import { ydoc } from "./yjs";

export const wsProvider = new WebsocketProvider(
  "ws://localhost:1234",
  "local-editor-doc", // room name
  ydoc,
);
