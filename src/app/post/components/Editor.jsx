"use client";

import { useMemo } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

/* Base64 업로드 어댑터: 업로드 이미지를 dataURL로 즉시 삽입 */
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
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new Base64UploadAdapter(loader);
  };
}

export default function Editor({ value, onChange }) {
  const config = useMemo(
    () => ({
      toolbar: {
        items: [
          "undo", "redo", "|",
          "heading", "|",
          "bold", "italic", "underline", "|",
          "link", "imageUpload", "mediaEmbed", "insertTable", "blockQuote", "|",
          "bulletedList", "numberedList", "|",
          "outdent", "indent",
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
      image: {
        toolbar: [
          "imageTextAlternative",
          "imageStyle:inline",
          "imageStyle:block",
          "imageStyle:side",
        ],
      },
      table: { contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"] },
      placeholder: "",
    }),
    []
  );

  return (
    <div className="[&_.ck-content]:text-[15px]">
      {/* Tailwind Preflight로 사라진 기본 스타일 복구 + 에디터 높이 고정 */}
      <style jsx global>{`
        /* 에디터 편집 영역 높이 고정 */
        .ck-editor__editable {
          min-height: 400px !important;
          max-height: 400px !important;
          overflow-y: auto !important;
        }

        /* ===== CKEditor 내용 영역 기본 스타일 복구 ===== */
        .ck-content h1 { font-size: 1.875rem; line-height: 2.25rem; font-weight: 700; }
        .ck-content h2 { font-size: 1.5rem;   line-height: 2rem;    font-weight: 700; }
        .ck-content h3 { font-size: 1.25rem;  line-height: 1.75rem; font-weight: 700; }

        .ck-content ul { list-style: disc !important;    margin-left: 1.25rem; padding-left: 1rem; }
        .ck-content ol { list-style: decimal !important; margin-left: 1.25rem; padding-left: 1rem; }
        .ck-content li { margin: 0.25rem 0; }

        .ck-content blockquote {
          border-left: 4px solid #e5e7eb;
          margin: 1rem 0;
          padding: 0.25rem 0 0.25rem 1rem;
          color: #4b5563;
        }
      `}</style>

      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={config}
        onChange={(_, editor) => onChange(editor.getData())}
      />
    </div>
  );
}
