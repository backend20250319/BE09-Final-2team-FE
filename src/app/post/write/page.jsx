"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import ConfirmModal, { MODAL_TYPES } from "@/components/common/ConfirmModal";
import { postAPI } from "@/lib/api";

const Editor = dynamic(() => import("../components/Editor"), { ssr: false });

export default function PostWritePage() {
  const router = useRouter();
  const sp = useSearchParams();
  const backTab = sp.get("tab") === "auction" ? "auction" : "tips";

  const [category, setCategory] = useState(
    backTab === "auction" ? "경매" : "육아 꿀팁"
  );
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]); // 선택: 이미지 첨부

  const [submitting, setSubmitting] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  // 에디터 내용 비어있는지 체크
  const isEmptyRichText = (html) => {
    if (typeof html !== "string" || html.trim() === "") return true;
    try {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const text = (doc.body.textContent || "")
        .replace(/\u200B/g, "")
        .replace(/\u00A0/g, " ")
        .trim();
      if (text.length > 0) return false;
      if (doc.querySelector("img,video,iframe,embed,object,table,figure img"))
        return false;
      return true;
    } catch {
      return !html.replace(/<[^>]*>/g, "").trim();
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    let html = content;
    // IME 폴백
    try {
      const live =
        document.querySelector(".ck-editor__editable")?.innerHTML || "";
      if (!html || isEmptyRichText(html)) {
        if (live) html = live;
      }
    } catch {}

    if (!title.trim()) return alert("제목을 입력해주세요.");
    if (isEmptyRichText(html)) return alert("내용을 입력해주세요.");

    try {
      setSubmitting(true);
      await postAPI.createPostMultipart({
        title,
        contentHtml: html,
        categoryName: sp.get("tab"), 
        files,
      });
      setShowComplete(true);
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || "등록 실패");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <style jsx global>{`
        .ck-editor__editable {
          min-height: 420px !important;
          max-height: 420px !important;
          overflow-y: auto !important;
        }
        .ck.ck-editor {
          width: 100%;
        }
      `}</style>

      <form onSubmit={onSubmit} className="space-y-5">
        {/* 카테고리 */}
        <div className="flex items-center gap-3">
          <label className="text-gray-700 text-sm w-20">카테고리</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-9 w-64 border rounded-md px-3 text-[13px] bg-white"
            disabled={submitting}
          >
            <option>육아 꿀팁</option>
            <option>경매</option>
          </select>
        </div>

        {/* 제목 */}
        <div className="flex items-center gap-3">
          <label className="text-gray-700 text-sm w-20">제목</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요.."
            className="h-10 flex-1 min-w-[280px] border rounded-md px-3 text-[13px]"
            disabled={submitting}
          />
        </div>

        {/* 에디터 */}
        <div className="border rounded-md">
          <Editor value={content} onChange={setContent} />
        </div>

        {/* (선택) 이미지 첨부 */}
        <div className="flex items-center gap-3">
          <label className="text-gray-700 text-sm w-20">이미지</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
            disabled={submitting}
            className="text-sm"
          />
        </div>

        {/* 버튼 */}
        <div className="flex justify-center gap-6 pt-4">
          <button
            type="button"
            onClick={() => router.push(`/post?tab=${backTab}`)}
            className="h-10 w-28 rounded-md border text-sm hover:bg-gray-50"
            disabled={submitting}
          >
            취소
          </button>
          <button
            type="submit"
            className="h-10 w-28 rounded-md text-white text-sm hover:brightness-95 disabled:opacity-60"
            style={{ backgroundColor: "#65A2EE" }}
            disabled={submitting}
          >
            {submitting ? "작성 중..." : "작성하기"}
          </button>
        </div>
      </form>

      <ConfirmModal
        open={showComplete}
        title="등록 완료"
        message="게시글이 등록되었습니다."
        onConfirm={() => {
          setShowComplete(false);
          router.push(`/post?tab=${backTab}`);
        }}
        type={MODAL_TYPES.CONFIRM_ONLY}
        confirmText="확인"
      />
    </div>
  );
}
