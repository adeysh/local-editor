"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";
import Collaboration from "@tiptap/extension-collaboration";

import { ydoc } from "@/app/lib/yjs";
import "@/app/lib/persistence";
import { useEditorState } from "@tiptap/react";
import "@/app/lib/ws-provider";

export default function Editor() {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Heading,

      Collaboration.configure({
        document: ydoc,
      }),
    ],
    immediatelyRender: false,
  });

  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) {
        return {
          isBold: false,
          isItalic: false,
          isH1: false,
          isH2: false,
        };
      }

      return {
        isBold: editor.isActive("bold"),
        isItalic: editor.isActive("italic"),
        isH1: editor.isActive("heading", { level: 1 }),
        isH2: editor.isActive("heading", { level: 2 }),
      };
    },
  });

  const {
    isBold = false,
    isItalic = false,
    isH1 = false,
    isH2 = false,
  } = editorState || {};

  if (!editor) return null;

  return (
    <div className="max-w-3xl mx-auto mt-10 border rounded-xl p-4 shadow-sm text-black">
      {/* Toolbar */}
      <div className="flex gap-2 mb-4 border-b pb-2">
        <button
          className={isBold ? "bg-gray-300" : ""}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </button>

        <button
          className={isItalic ? "bg-gray-300" : ""}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </button>

        <button
          className={isH1 ? "bg-gray-300" : ""}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          H1
        </button>

        <button
          className={isH2 ? "bg-gray-300" : ""}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
