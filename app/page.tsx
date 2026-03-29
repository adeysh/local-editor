"use client";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");

  return (
    <div style={{ padding: 20 }}>
      <h1>Local Editor V1</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        cols={50}
      />
    </div>
  );
}
