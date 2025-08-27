"use client";

import { useEffect, useMemo, useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

/* Base64 업로드 어댑터 */
class Base64UploadAdapter {
  constructor(loader) { this.loader = loader; }
  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve({ default: reader.result });
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        })
    );
  }
  abort() {}
}
function Base64UploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => new Base64UploadAdapter(loader);
}

export default function Editor({ value = "", onChange }) {
  const editorRef = useRef(null);
  const destroyedRef = useRef(false);

  const config = useMemo(
    () => ({
      toolbar: {
        items: [
          "undo","redo","|","heading","|",
          "bold","italic","underline","|",
          "link","imageUpload","mediaEmbed","insertTable","blockQuote","|",
          "bulletedList","numberedList","|","outdent","indent",
        ],
        shouldNotGroupWhenFull: true,
      },
      extraPlugins: [Base64UploadAdapterPlugin],
      heading: {
        options: [
          { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
          { model: "heading1", view: "h1", title: "Heading 1", class: "ck-heading_heading1" },
          { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
          { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
        ],
      },
      image: { toolbar: ["imageTextAlternative","imageStyle:inline","imageStyle:block","imageStyle:side"] },
      table: { contentToolbar: ["tableColumn","tableRow","mergeTableCells"] },
      placeholder: "",
    }),
    []
  );

  // 언마운트 시 수동 destroy 호출하지 않음 (React-CKEditor가 자체 정리)
  useEffect(() => {
    return () => { destroyedRef.current = true; editorRef.current = null; };
  }, []);

  return (
    <div className="[&_.ck-content]:text-[15px]">
      <style jsx global>{`
        .ck-editor__editable { min-height: 400px !important; max-height: 400px !important; overflow-y: auto !important; }
        .ck-content h1 { font-size: 1.875rem; line-height: 2.25rem; font-weight: 700; }
        .ck-content h2 { font-size: 1.5rem; line-height: 2rem; font-weight: 700; }
        .ck-content h3 { font-size: 1.25rem; line-height: 1.75rem; font-weight: 700; }
        .ck-content ul { list-style: disc !important; margin-left: 1.25rem; padding-left: 1rem; }
        .ck-content ol { list-style: decimal !important; margin-left: 1.25rem; padding-left: 1rem; }
        .ck-content li { margin: 0.25rem 0; }
        .ck-content blockquote { border-left: 4px solid #e5e7eb; margin: 1rem 0; padding: 0.25rem 0 0.25rem 1rem; color: #4b5563; }
      `}</style>

      <CKEditor
        editor={ClassicEditor}
        data={value || ""}
        config={config}
        onReady={(editor) => {
          editorRef.current = editor;
          try {
            editor.editing.view.document.on("compositionend", () => {
              if (!destroyedRef.current) onChange?.(editor.getData());
            });
          } catch {}
        }}
        onChange={(_, editor) => {
          if (!destroyedRef.current) {
            try { onChange?.(editor.getData()); } catch {}
          }
        }}
        onBlur={(_, editor) => {
          if (!destroyedRef.current) {
            try { onChange?.(editor.getData()); } catch {}
          }
        }}
        onError={() => {}}
      />
    </div>
  );
}
