"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function Editor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Start writing...</p>",
    immediatelyRender: false, // prevents hydration mismatch
  });

  if (!editor) return null;

  return (
    <div className="max-w-3xl mx-auto mt-10 border rounded-xl p-4 shadow-sm text-black">
      <EditorContent editor={editor} />
    </div>
  );
}
