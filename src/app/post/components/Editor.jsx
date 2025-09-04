"use client";

import { useEffect, useMemo, useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

/* =========================
   Base64 업로드 어댑터
========================= */
class Base64UploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }
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
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) =>
    new Base64UploadAdapter(loader);
}

/* =========================
   CKEditor type-around 제거
========================= */
function injectTypeAroundKillerCSS() {
  const id = "ck-typearound-killer";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
/* CKEditor type-around (삼각형 버튼, fake caret 등) 제거 */
.ck-widget__type-around,
.ck-widget__type-around__button,
.ck-widget__type-around__button_before,
.ck-widget__type-around__button_after,
.ck-widget__type-around__fake-caret,
div[class*="ck-widget__type-around"] {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
  width: 0 !important;
  height: 0 !important;
}
  `.trim();
  document.head.appendChild(style);
}

/* =========================
   컴포넌트
========================= */
export default function Editor({ value = "", onChange }) {
  const editorRef = useRef(null);
  const destroyedRef = useRef(false);

  const config = useMemo(
    () => ({
      toolbar: {
        items: [
          "undo",
          "redo",
          "|",
          "heading",
          "|",
          "bold",
          "italic",
          "underline",
          "|",
          "link",
          "imageUpload",
          "mediaEmbed",
          "insertTable",
          "blockQuote",
          "|",
          "bulletedList",
          "numberedList",
          "|",
          "outdent",
          "indent",
        ],
        shouldNotGroupWhenFull: true,
      },
      extraPlugins: [Base64UploadAdapterPlugin],
      heading: {
        options: [
          {
            model: "paragraph",
            title: "Paragraph",
            class: "ck-heading_paragraph",
          },
          {
            model: "heading1",
            view: "h1",
            title: "Heading 1",
            class: "ck-heading_heading1",
          },
          {
            model: "heading2",
            view: "h2",
            title: "Heading 2",
            class: "ck-heading_heading2",
          },
          {
            model: "heading3",
            view: "h3",
            title: "Heading 3",
            class: "ck-heading_heading3",
          },
        ],
      },
      image: {
        toolbar: [
          "imageTextAlternative",
          "imageStyle:inline",
          "imageStyle:block",
          "imageStyle:side",
        ],
      },
      table: { contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"] },
      placeholder: "내용을 입력하세요...",
    }),
    []
  );

  useEffect(() => {
    return () => {
      destroyedRef.current = true;
      editorRef.current = null;
    };
  }, []);

  return (
    <div className="[&_.ck-content]:text-[15px]">
      {/* CKEditor 스타일 보정 */}
      <style jsx global>{`
        .ck-editor__editable {
          min-height: 400px !important;
          max-height: 400px !important;
          overflow-y: auto !important;
        }
        .ck-content h1 {
          font-size: 1.875rem;
          line-height: 2.25rem;
          font-weight: 700;
        }
        .ck-content h2 {
          font-size: 1.5rem;
          line-height: 2rem;
          font-weight: 700;
        }
        .ck-content h3 {
          font-size: 1.25rem;
          line-height: 1.75rem;
          font-weight: 700;
        }
        .ck-content ul {
          list-style: disc !important;
          margin-left: 1.25rem;
          padding-left: 1rem;
        }
        .ck-content ol {
          list-style: decimal !important;
          margin-left: 1.25rem;
          padding-left: 1rem;
        }
        .ck-content li {
          margin: 0.25rem 0;
        }
        .ck-content blockquote {
          border-left: 4px solid #e5e7eb;
          margin: 1rem 0;
          padding: 0.25rem 0 0.25rem 1rem;
          color: #4b5563;
        }
        .ck-content figure,
        .ck-content figure.image,
        .ck-content .image {
          position: static !important;
          background: none !important;
          border: 0 !important;
        }
        .ck-content img {
          max-width: 100% !important;
          height: auto !important;
          display: block !important;
        }
      `}</style>

      <CKEditor
        editor={ClassicEditor}
        data={value || ""}
        config={config}
        onReady={(editor) => {
          editorRef.current = editor;
          try {
            injectTypeAroundKillerCSS(); // 삼각형 제거 CSS 주입
            // IME 입력 끝날 때 동기화
            editor.editing.view.document.on("compositionend", () => {
              if (!destroyedRef.current) onChange?.(editor.getData());
            });
          } catch {}
        }}
        onChange={(_, editor) => {
          if (!destroyedRef.current) {
            try {
              onChange?.(editor.getData());
            } catch {}
          }
        }}
        onBlur={(_, editor) => {
          if (!destroyedRef.current) {
            try {
              onChange?.(editor.getData());
            } catch {}
          }
        }}
      />
    </div>
  );
}
