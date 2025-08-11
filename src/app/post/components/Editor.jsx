"use client";

import { useMemo } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

/* ✅ 커스텀 업로드 어댑터: 파일을 Base64 dataURL로 변환해서 본문에 바로 삽입 */
class Base64UploadAdapter {
  constructor(loader) {
    this.loader = loader; // CKEditor가 넘겨주는 파일 로더
  }
  // 업로드 시작
  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            // CKEditor는 { default: 이미지URL } 형태를 기대
            resolve({ default: reader.result });
          };
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        })
    );
  }
  // 취소(옵션)
  abort() {}
}

/* ✅ 플러그인 등록 함수 */
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
          "undo","redo","|",
          "heading","|",
          "bold","italic","underline","|",
          "link","imageUpload","mediaEmbed","insertTable","blockQuote","|",
          "bulletedList","numberedList","|",
          "outdent","indent","|",
          "alignment",
        ],
        shouldNotGroupWhenFull: true,
      },
      /* ✅ 여기서 커스텀 어댑터 활성화 */
      extraPlugins: [Base64UploadAdapterPlugin],

      heading: {
        options: [
          { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
          { model: "heading1", view: "h1", title: "Heading 1", class: "ck-heading_heading1" },
          { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
          { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
        ],
      },
      placeholder: "",
      image: {
        toolbar: [
          "imageTextAlternative",
          "imageStyle:inline",
          "imageStyle:block",
          "imageStyle:side",
        ],
      },
      table: { contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"] },
    }),
    []
  );

  return (
    <div className="[&_.ck-content]:min-h-[360px] [&_.ck-content]:text-[15px]">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={config}
        onChange={(_, editor) => onChange(editor.getData())}
      />
    </div>
  );
}
