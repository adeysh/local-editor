import { IndexeddbPersistence } from "y-indexeddb";
import { ydoc } from "./yjs";

const provider = new IndexeddbPersistence("local-editor-doc", ydoc);

provider.on("synced", () => {
  console.log("Content loaded from IndexedDB");
});
