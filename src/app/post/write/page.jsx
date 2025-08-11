"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { savePost, formatDate } from "../lib/postStorage";

// 형제 폴더의 에디터
const Editor = dynamic(() => import("../components/Editor"), { ssr: false });

export default function PostWritePage() {
  const router = useRouter();
  const sp = useSearchParams();
  const backTab = sp.get("tab") === "groupbuy" ? "groupbuy" : "tips";

  const [category, setCategory] = useState(backTab === "groupbuy" ? "공동구매" : "육아 꿀팁");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [people, setPeople] = useState(2);

  const onCancel = () => router.push(`/post?tab=${backTab}`);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("제목을 입력해주세요.");
    if (!content.replace(/<[^>]*>/g, "").trim()) return alert("내용을 입력해주세요.");

    const base = {
      id: Date.now(),
      title,
      writer: "홍길동",
      date: formatDate(new Date()),
      views: 0,
      comments: 0,
      category,
      content,
    };

    const post =
      category === "공동구매"
        ? { ...base, status: "모집중", region: "", people }
        : base;

    savePost(post);
    alert("작성되었습니다!");
    router.push(`/post?tab=${category === "공동구매" ? "groupbuy" : "tips"}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <form onSubmit={onSubmit} className="space-y-5">
        {/* 카테고리: 좌우정렬 */}
        <div className="flex items-center gap-3">
          <label className="text-gray-700 text-sm w-16">카테고리</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-9 w-56 border rounded-sm px-2 text-[13px] bg-white"
          >
            <option>육아 꿀팁</option>
            <option>공동구매</option>
          </select>
        </div>

        {/* 제목: 좌우정렬 + 공동구매 옵션 */}
        <div className="flex items-center gap-3">
          <label className="text-gray-700 text-sm w-16">제목</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요.."
            className="h-9 w-80 border rounded-sm px-3 text-[13px] truncate"
          />

          {category === "공동구매" && (
            <div className="flex items-center gap-3 ml-auto">
              <span className="hidden sm:inline text-[12px] text-gray-500">
                공동 구매지역 선택은 필수입니다.
              </span>

              <div className="flex items-center gap-1 text-[12px]">
                <span className="text-gray-700">참여 인원</span>
                <select
                  value={people}
                  onChange={(e) => setPeople(Number(e.target.value))}
                  className="h-7 border rounded-sm px-2 text-[12px] bg-white"
                >
                  {Array.from({ length: 9 }, (_, i) => i + 2).map((n) => (
                    <option key={n} value={n}>{n}명</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="h-7 px-3 rounded text-white text-[12px] hover:brightness-95"
                style={{ backgroundColor: "#65A2EE" }}
              >
                지역 선택
              </button>
            </div>
          )}
        </div>

        {/* 에디터 */}
        <div className="border rounded-sm">
          <Editor value={content} onChange={setContent} />
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-center gap-6 pt-4">
          <button type="button" onClick={onCancel} className="h-9 w-28 rounded border text-sm hover:bg-gray-50">
            취소
          </button>
          <button
            type="submit"
            className="h-9 w-28 rounded text-white text-sm hover:brightness-95"
            style={{ backgroundColor: "#65A2EE" }}
          >
            작성하기
          </button>
        </div>
      </form>
    </div>
  );
}
