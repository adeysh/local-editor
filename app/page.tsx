"use client";
import * as Y from "yjs";
import { useState, useEffect } from "react";
import { IndexeddbPersistence } from "y-indexeddb";

const ydoc = new Y.Doc();
const yText = ydoc.getText("editor");

export default function Home() {
  const [text, setText] = useState("");
  const persistence = new IndexeddbPersistence("my-doc", ydoc);

  useEffect(() => {
    // Initial load
    setText(yText.toString());

    // Listen for changes
    yText.observe(() => {
      setText(yText.toString());
    });
  }, []);

  useEffect(() => {
    persistence.whenSynced.then(() => {
      setText(yText.toString());
    });

    yText.observe(() => {
      setText(yText.toString());
    });
  }, []);

  const handleChange = (value: string) => {
    ydoc.transact(() => {
      yText.delete(0, yText.length);
      yText.insert(0, value);
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Yjs Editor</h1>
      <textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        rows={10}
        cols={50}
      />
    </div>
  );
}
