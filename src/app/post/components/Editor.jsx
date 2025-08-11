"use client";

import { useMemo } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

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
