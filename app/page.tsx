"use client";
import * as Y from "yjs";
import { useState, useEffect } from "react";
import { IndexeddbPersistence } from "y-indexeddb";
import { WebsocketProvider } from "y-websocket";

const ydoc = new Y.Doc();
const yText = ydoc.getText("editor");

const provider = new WebsocketProvider("ws://localhost:1234", "my-doc", ydoc);
const awareness = provider.awareness;

const user = {
  name: "Adesh",
  color: "#" + Math.floor(Math.random() * 16777215).toString(16),
};

awareness.setLocalStateField("user", user);

provider.on("status", (event) => {
  console.log(event.status); // connected / disconnected
});

export default function Home() {
  const [text, setText] = useState(() => yText.toString());
  const persistence = new IndexeddbPersistence("my-doc", ydoc);

  const [users, setUsers] = useState<
    { user: { name: string; color: string } }[]
  >([]);

  useEffect(() => {
    const updateUsers = () => {
      const states = Array.from(awareness.getStates().values());

      states.forEach((s) => {
        console.log(s.cursor?.position);
      });

      const formattedUsers = states
        .filter((state) => state.user)
        .map((state) => ({ user: state.user }));
      setUsers(formattedUsers);
    };

    awareness.on("change", updateUsers);

    return () => {
      awareness.off("change", updateUsers);
    };
  }, []);

  useEffect(() => {
    const handleChange = () => {
      setText(yText.toString());
    };

    yText.observe(handleChange);

    persistence.whenSynced.then(() => {
      setText(yText.toString());
    });

    return () => {
      yText.unobserve(handleChange);
    };
  }, []);

  const handleChange = (value: string) => {
    ydoc.transact(() => {
      yText.delete(0, yText.length);
      yText.insert(0, value);
    });
  };

  interface CursorState {
    position: number;
  }

  interface UserState {
    name: string;
    color: string;
  }

  const handleCursor = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const position = e.currentTarget.selectionStart;

    awareness.setLocalStateField("cursor", {
      position,
    } as CursorState);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Yjs Editor</h1>

      <div>
        <h3>Active Users:</h3>
        {users.map((u, i) => (
          <div
            key={i}
            style={{ color: u.user?.color }}
          >
            {u.user?.name}
          </div>
        ))}
      </div>

      <textarea
        title="editor"
        placeholder="enter your text here"
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        onSelect={handleCursor}
        rows={10}
        cols={50}
      />
    </div>
  );
}
