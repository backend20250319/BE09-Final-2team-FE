"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "./css/editor.css";

// CKEditor를 동적으로 import하여 SSR 문제 해결
const CKEditor = dynamic(() => import("@ckeditor/ckeditor5-react").then((mod) => mod.CKEditor), {
  ssr: false,
  loading: () => <div className="p-4 text-center">에디터 로딩 중...</div>,
});

const ClassicEditor = dynamic(() => import("@ckeditor/ckeditor5-build-classic"), {
  ssr: false,
  loading: () => <div className="p-4 text-center">에디터 빌드 로딩 중...</div>,
});

export default function CKEditorExample() {
  const [editorData, setEditorData] = useState("<p>기본 에디터 내용입니다.</p>");
  const [customEditorData, setCustomEditorData] = useState("<p>커스텀 에디터 내용입니다.</p>");
  const [readOnlyData, setReadOnlyData] = useState("<p>읽기 전용 에디터입니다. 편집할 수 없습니다.</p>");
  const [outputData, setOutputData] = useState("");
  const [isEditorLoaded, setIsEditorLoaded] = useState(false);

  useEffect(() => {
    setIsEditorLoaded(true);
  }, []);

  // 기본 에디터 설정 (수정된 구성)
  const editorConfiguration = {
    toolbar: [
      "heading",
      "|",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "link",
      "|",
      "bulletedList",
      "numberedList",
      "|",
      "outdent",
      "indent",
      "|",
      "imageUpload",
      "blockQuote",
      "insertTable",
      "mediaEmbed",
      "|",
      "undo",
      "redo",
    ],
    language: "ko",
    list: {
      properties: {
        styles: true,
        startIndex: true,
        reversed: true,
      },
    },
    image: {
      upload: {
        types: ["jpeg", "png", "gif", "bmp", "webp", "tiff"],
      },
      toolbar: ["imageTextAlternative", "imageStyle:full", "imageStyle:side"],
    },
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
    },
    heading: {
      options: [
        { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
        { model: "heading1", view: "h1", title: "Heading 1", class: "ck-heading_heading1" },
        { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
        { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
      ],
    },
  };

  // 커스텀 에디터 설정 (제한된 툴바)
  const customEditorConfiguration = {
    toolbar: ["bold", "italic", "underline", "link", "|", "bulletedList", "numberedList", "|", "undo", "redo"],
    language: "ko",
    list: {
      properties: {
        styles: true,
        startIndex: true,
        reversed: true,
      },
    },
  };

  // 이미지 업로드 핸들러 (데모용)
  const handleImageUpload = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          default: reader.result,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // 에디터 로딩 상태 확인 및 에러 처리
  if (!isEditorLoaded) {
    return (
      <div className="space-y-8">
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">📝 CKEditor 로딩 중...</h3>
          <div className="flex items-center justify-center h-32">
            <div className="text-gray-500">에디터를 불러오는 중입니다...</div>
          </div>
        </div>
      </div>
    );
  }

  // CKEditor 컴포넌트가 로드되지 않은 경우 처리
  if (typeof window !== "undefined" && (!CKEditor || !ClassicEditor)) {
    return (
      <div className="space-y-8">
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">⚠️ CKEditor 로드 실패</h3>
          <div className="flex items-center justify-center h-32">
            <div className="text-red-500">에디터를 불러오는데 실패했습니다. 페이지를 새로고침해주세요.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 기본 에디터 */}
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">📝 기본 CKEditor5</h3>
        <p className="text-sm text-gray-600 mb-4">
          기본적인 CKEditor5 에디터입니다. 모든 기본 기능을 사용할 수 있습니다.
        </p>
        <div className="border rounded">
          {CKEditor && ClassicEditor ? (
            <CKEditor
              editor={ClassicEditor}
              config={editorConfiguration}
              data={editorData}
              onReady={(editor) => {
                console.log("Editor is ready to use!", editor);
                // 에디터가 준비되면 포커스 설정
                editor.focus();
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setEditorData(data);
                console.log("Editor data changed:", data);
              }}
              onBlur={(event, editor) => {
                console.log("Blur.", editor);
              }}
              onFocus={(event, editor) => {
                console.log("Focus.", editor);
              }}
            />
          ) : (
            <div className="p-4 text-center text-gray-500">에디터를 로드하는 중입니다...</div>
          )}
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
          <strong>현재 에디터 내용:</strong>
          <div className="mt-2 max-h-32 overflow-y-auto" dangerouslySetInnerHTML={{ __html: editorData }} />
        </div>
      </div>

      {/* 커스텀 에디터 */}
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">🔧 커스텀 툴바 에디터</h3>
        <p className="text-sm text-gray-600 mb-4">
          제한된 툴바를 가진 커스텀 에디터입니다. 기본적인 텍스트 서식만 사용 가능합니다.
        </p>
        <div className="border rounded">
          {CKEditor && ClassicEditor ? (
            <CKEditor
              editor={ClassicEditor}
              config={customEditorConfiguration}
              data={customEditorData}
              onReady={(editor) => {
                console.log("Custom editor is ready!", editor);
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setCustomEditorData(data);
              }}
            />
          ) : (
            <div className="p-4 text-center text-gray-500">에디터를 로드하는 중입니다...</div>
          )}
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
          <strong>현재 에디터 내용:</strong>
          <div className="mt-2 max-h-32 overflow-y-auto" dangerouslySetInnerHTML={{ __html: customEditorData }} />
        </div>
      </div>

      {/* 데이터 출력 예제 */}
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">📤 데이터 출력 예제</h3>
        <p className="text-sm text-gray-600 mb-4">에디터의 내용을 다른 컴포넌트에서 사용하는 예제입니다.</p>
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setOutputData(editorData)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            기본 에디터 내용 가져오기
          </button>
          <button
            onClick={() => setOutputData(customEditorData)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            커스텀 에디터 내용 가져오기
          </button>
          <button
            onClick={() => setOutputData("")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            초기화
          </button>
        </div>
        {outputData && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h4 className="font-semibold mb-2">출력된 데이터:</h4>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: outputData }} />
          </div>
        )}
      </div>

      {/* 기능 테스트 가이드 */}
      <div className="border rounded-lg p-6 bg-green-50">
        <h3 className="text-lg font-semibold mb-4">🧪 기능 테스트 가이드</h3>
        <div className="space-y-3 text-sm">
          <div>
            <strong>1. 목록 기능 테스트:</strong>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li>텍스트를 선택하고 글머리 기호 버튼 클릭</li>
              <li>텍스트를 선택하고 번호 매기기 버튼 클릭</li>
              <li>Enter 키로 새 항목 추가</li>
              <li>Tab 키로 하위 목록 생성</li>
            </ul>
          </div>
          <div>
            <strong>2. 들여쓰기 기능 테스트:</strong>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li>텍스트나 목록을 선택하고 들여쓰기 버튼 클릭</li>
              <li>Shift + Tab으로 내어쓰기</li>
              <li>여러 줄 선택 시 일괄 적용</li>
            </ul>
          </div>
          <div>
            <strong>3. 이미지 업로드 테스트:</strong>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li>이미지 업로드 버튼 클릭</li>
              <li>로컬 이미지 파일 선택</li>
              <li>드래그 앤 드롭으로 이미지 추가</li>
              <li>이미지 크기 조정 및 정렬</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 문제 해결 가이드 */}
      <div className="border rounded-lg p-6 bg-red-50">
        <h3 className="text-lg font-semibold mb-4">🔧 툴바 문제 해결 가이드</h3>
        <div className="space-y-3 text-sm">
          <div>
            <strong>1. 목록이 작동하지 않는 경우:</strong>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li>list 플러그인이 포함된 빌드 확인</li>
              <li>toolbar 설정에서 'bulletedList', 'numberedList' 확인</li>
              <li>브라우저 콘솔에서 에러 메시지 확인</li>
              <li>배열 형태의 toolbar 설정 사용</li>
            </ul>
          </div>
          <div>
            <strong>2. 들여쓰기가 작동하지 않는 경우:</strong>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li>indent 플러그인이 포함된 빌드 확인</li>
              <li>toolbar 설정에서 'outdent', 'indent' 확인</li>
              <li>텍스트나 목록이 선택되어 있는지 확인</li>
              <li>배열 형태의 toolbar 설정 사용</li>
            </ul>
          </div>
          <div>
            <strong>3. 이미지 업로드가 작동하지 않는 경우:</strong>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li>image 플러그인이 포함된 빌드 확인</li>
              <li>toolbar 설정에서 'imageUpload' 확인</li>
              <li>서버 측 업로드 핸들러 설정 필요</li>
              <li>파일 형식 제한 확인</li>
            </ul>
          </div>
          <div>
            <strong>4. EditorWatchdog 오류 해결:</strong>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li>CKEditor 버전 호환성 문제일 수 있음</li>
              <li>브라우저 캐시 완전 삭제 후 새로고침</li>
              <li>node_modules 삭제 후 npm install 재실행</li>
              <li>CKEditor 패키지 버전 업데이트</li>
              <li>Next.js dynamic import 사용 확인</li>
            </ul>
          </div>
          <div>
            <strong>5. 일반적인 해결 방법:</strong>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li>브라우저 캐시 삭제 후 새로고침</li>
              <li>개발자 도구에서 콘솔 에러 확인</li>
              <li>CKEditor 버전 호환성 확인</li>
              <li>CSS 충돌 확인</li>
              <li>배열 형태의 toolbar 설정 사용 권장</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 사용법 가이드 */}
      <div className="border rounded-lg p-6 bg-blue-50">
        <h3 className="text-lg font-semibold mb-4">📚 사용법 가이드</h3>
        <div className="space-y-3 text-sm">
          <div>
            <strong>1. 설치:</strong>
            <code className="block bg-gray-100 p-2 rounded mt-1">
              npm install @ckeditor/ckeditor5-react @ckeditor/ckeditor5-build-classic
            </code>
          </div>
          <div>
            <strong>2. 기본 사용법:</strong>
            <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-x-auto">
              {`import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

<CKEditor
  editor={ClassicEditor}
  data="<p>초기 내용</p>"
  onChange={(event, editor) => {
    const data = editor.getData();
    console.log(data);
  }}
/>`}
            </pre>
          </div>
          <div>
            <strong>3. 주요 이벤트:</strong>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>
                <code>onReady</code>: 에디터가 준비되었을 때
              </li>
              <li>
                <code>onChange</code>: 내용이 변경되었을 때
              </li>
              <li>
                <code>onBlur</code>: 에디터가 포커스를 잃었을 때
              </li>
              <li>
                <code>onFocus</code>: 에디터가 포커스를 받았을 때
              </li>
            </ul>
          </div>
          <div>
            <strong>4. 설정 옵션:</strong>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>
                <code>toolbar</code>: 툴바 구성 (배열 형태 권장)
              </li>
              <li>
                <code>language</code>: 언어 설정
              </li>
              <li>
                <code>readOnly</code>: 읽기 전용 모드
              </li>
              <li>
                <code>list</code>: 목록 설정
              </li>
              <li>
                <code>image</code>: 이미지 설정
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
