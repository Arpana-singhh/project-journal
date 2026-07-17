"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Quill touches `document` on import, so it can't run during SSR - load it
// client-only.
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const QUILL_MODULES = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }],
    ["clean"],
  ],
};

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  return (
    <div className="note-rich-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={QUILL_MODULES}
        placeholder={placeholder}
      />
    </div>
  );
}
