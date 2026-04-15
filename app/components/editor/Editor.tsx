"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";

export default function Editor() {
  const [, forceUpdate] = useState(0);

  const refresh = () => {
    forceUpdate((prev) => prev + 1);
  };

  const runCommand = (command: () => void) => {
    command();
    refresh();
  };

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Start writing...</p>",
    immediatelyRender: false,

    onUpdate: () => {
      forceUpdate((prev) => prev + 1);
    },

    onSelectionUpdate: () => {
      forceUpdate((prev) => prev + 1);
    },
  });

  if (!editor) return null;

  return (
    <div className="max-w-3xl mx-auto mt-10 border rounded-xl p-4 shadow-sm text-black">
      {/* Toolbar */}
      <div className="flex gap-2 mb-4 border-b pb-2">
        <button
          className={editor.isActive("bold") ? "bg-gray-300" : ""}
          onClick={() =>
            runCommand(() => editor.chain().focus().toggleBold().run())
          }
        >
          Bold
        </button>

        <button
          className={editor.isActive("italic") ? "bg-gray-300" : ""}
          onClick={() =>
            runCommand(() => editor.chain().focus().toggleItalic().run())
          }
        >
          Italic
        </button>

        <button
          className={
            editor.isActive("heading", { level: 1 }) ? "bg-gray-300" : ""
          }
          onClick={() =>
            runCommand(() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run(),
            )
          }
        >
          H1
        </button>

        <button
          className={
            editor.isActive("heading", { level: 2 }) ? "bg-gray-300" : ""
          }
          onClick={() =>
            runCommand(() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run(),
            )
          }
        >
          H2
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
