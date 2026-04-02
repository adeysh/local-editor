"use client";

import { useEffect, useMemo } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";
import BubbleMenuExtension from "@tiptap/extension-bubble-menu";
import { Toolbar } from "@components/Toolbar";

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

  useEffect(() => {
    const persistence = new IndexeddbPersistence("my-doc", ydoc);

    persistence.whenSynced.then(() => {
      console.log("Loaded from IndexedDB");
    });

    return () => {
      persistence.destroy();
    };
  }, [ydoc]);

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          undoRedo: false,
        }),
        Collaboration.configure({
          document: ydoc,
        }),
        BubbleMenuExtension,
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
    <main className="flex flex-col h-screen bg-gray-50">
      <Toolbar editor={editor} />

      {/* The Editor Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-12 lg:p-20">
        <div className="max-w-4xl mx-auto bg-white min-h-[1056px] shadow-sm border border-gray-200 rounded-sm p-16">
          <EditorContent
            editor={editor}
            className="prose prose-slate max-w-none focus:outline-none min-h-full"
          />
        </div>
      </div>

      {/* The Floating Bubble Menu */}
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100, zIndex: 100 }}
          className="flex bg-slate-800 text-white rounded-lg shadow-xl overflow-hidden divide-x divide-slate-700"
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="p-2 px-4 hover:bg-slate-700"
          >
            B
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="p-2 px-4 hover:bg-slate-700"
          >
            I
          </button>
        </BubbleMenu>
      )}
    </main>
  );
}
