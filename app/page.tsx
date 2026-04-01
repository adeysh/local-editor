"use client";

import { useEffect, useMemo } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

// 1. Move random generation OUTSIDE the component.
// This runs once when the file is loaded, making it stable for the component's lifetime.
const INITIAL_USER = {
  name: `User ${Math.floor(Math.random() * 100)}`,
  color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
};

export default function Home() {
  // 2. Initialize Yjs Doc once
  const ydoc = useMemo(() => new Y.Doc(), []);

  // 3. Initialize Provider (only in browser)
  const provider = useMemo(() => {
    if (typeof window === "undefined") return null;
    return new WebsocketProvider("ws://localhost:1234", "my-room", ydoc);
  }, [ydoc]);

  useEffect(() => {
    if (!provider) return;

    const checkStatus = () => {
      console.log("WebSocket Connected:", provider.wsconnected);
    };

    provider.on("status", checkStatus);
    return () => provider.off("status", checkStatus);
  }, [provider]);

  // 4. Handle Side Effects (Awareness & Cleanup)
  useEffect(() => {
    if (!provider) return;

    provider.awareness.setLocalStateField("user", INITIAL_USER);

    return () => {
      provider.destroy();
      ydoc.destroy();
    };
  }, [provider, ydoc]);

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          undoRedo: false,
        }),
        Collaboration.configure({
          document: ydoc,
        }),
        // Use the stable INITIAL_USER here
        ...(provider
          ? [
              CollaborationCaret.configure({
                provider,
                user: INITIAL_USER,
              }),
            ]
          : []),
      ],
      immediatelyRender: false,
    },
    [provider, ydoc],
  );

  if (!editor) return null;

  return (
    <div className="p-8">
      <div className="border p-4 min-h-[300px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
