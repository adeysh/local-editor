import type { Editor } from "@tiptap/react";

export const Toolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  const btnClass = (name: string, attrs?: any) =>
    `p-2 px-3 rounded hover:bg-gray-100 transition-colors text-sm font-medium ${
      editor.isActive(name, attrs)
        ? "bg-blue-100 text-blue-700"
        : "text-gray-600"
    }`;

  return (
    <div className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-1 shadow-sm">
      <div className="flex items-center gap-1 border-r pr-2 mr-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnClass("bold")}
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btnClass("italic")}
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={btnClass("strike")}
        >
          S
        </button>
      </div>

      <div className="flex items-center gap-1 border-r pr-2 mr-2">
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={btnClass("heading", { level: 1 })}
        >
          H1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={btnClass("heading", { level: 2 })}
        >
          H2
        </button>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btnClass("bulletList")}
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btnClass("orderedList")}
        >
          1. List
        </button>
      </div>

      {/* Collaboration Undo/Redo (Uses Collab history) */}
      <div className="ml-auto flex gap-1">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="p-2 text-gray-500 hover:text-black"
        >
          Undo
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="p-2 text-gray-500 hover:text-black"
        >
          Redo
        </button>
      </div>
    </div>
  );
};
