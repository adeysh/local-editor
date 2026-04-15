"use client";

import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/app/components/editor/Editor"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-6 text-black">
        Local First Editor (Phase 1)
      </h1>
      <Editor />
    </main>
  );
}
