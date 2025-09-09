"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import ConfirmModal, { MODAL_TYPES } from "@/components/common/ConfirmModal";
import { postAPI } from "@/lib/api";

const Editor = dynamic(() => import("../components/Editor"), { ssr: false });

/* ====== 백엔드 직접 호출(수정용) ====== */
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1").replace(/\/$/, "");
const POST_URL = "/post-service";

/* 토큰 읽기 (axios 인터셉터와 동일 로직을 페이지에서 재현) */
function getAccessToken() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("user-storage");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.accessToken || null;
  } catch {
    return null;
  }
}

/* 에디터 비어있음 체크(네가 쓰던 로직 유지) */
function isEmptyRichText(html) {
  if (typeof html !== "string" || html.trim() === "") return true;
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const text = (doc.body.textContent || "")
      .replace(/\u200B/g, "")
      .replace(/\u00A0/g, " ")
      .trim();
    if (text.length > 0) return false;
    if (doc.querySelector("img,video,iframe,embed,object,table,figure img")) return false;
    return true;
  } catch {
    return !html.replace(/<[^>]*>/g, "").trim();
  }
}

export default function PostWritePage() {
  const router = useRouter();
  const sp = useSearchParams();

  const backTab = sp.get("tab") === "auction" ? "auction" : "tips";
  const isEdit = Boolean(sp.get("id"));
  const postId = sp.get("id");

  /* ====== 상태 (UI 그대로 유지) ====== */
  const [category, setCategory] = useState(backTab === "auction" ? "경매" : "육아 꿀팁");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [initializing, setInitializing] = useState(isEdit); // 수정모드: 처음 로딩 표시
  const [submitting, setSubmitting] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  /* ====== 수정 모드: 기존 글 불러오기 ====== */
  const fetchPost = useCallback(async () => {
    if (!isEdit || !postId) return;
    setInitializing(true);
    try {
      const resp = await postAPI.getPost(postId); // ApiResponse<{ post, comments, like }>
      const p = resp?.data?.data?.post || resp?.data?.data || resp?.data;
      setTitle(p?.title || "");
      setContent(p?.contentHtml || p?.content || "");

      // 서버 DTO에 카테고리명이 없으니, 쿼리 탭에 맞춰 고정 표시
      setCategory(backTab === "auction" ? "경매" : "육아 꿀팁");
    } catch (e) {
      console.error(e);
      alert("게시글을 불러오지 못했습니다.");
      router.push(`/post?tab=${backTab}`);
    } finally {
      setInitializing(false);
    }
  }, [isEdit, postId, backTab, router]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  /* ====== 제출 ====== */
  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    // 에디터에서 최신 HTML 확보 (네가 쓰던 IME 폴백 그대로 유지)
    let html = content;
    try {
      const live = document.querySelector(".ck-editor__editable")?.innerHTML || "";
      if (!html || isEmptyRichText(html)) {
        if (live) html = live;
      }
    } catch {}

    if (!title.trim()) return alert("제목을 입력해주세요.");
    if (isEmptyRichText(html)) return alert("내용을 입력해주세요.");

    try {
      setSubmitting(true);

      if (isEdit && postId) {
        // ✅ 수정: 카테고리 변경 불가 → 제목/본문만 PUT
        const token = getAccessToken();
        const url = `${API_BASE_URL}${POST_URL}/posts/${encodeURIComponent(postId)}`;
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const resp = await fetch(url, {
          method: "PUT",
          headers,
          credentials: "include",
          body: JSON.stringify({ title, contentHtml: html }),
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

        setShowComplete(true);
        return;
      }

      // 🆕 작성: 멀티파트 (에디터 업로드만 쓴다 했으니 files 없이)
      await postAPI.createPostMultipart({
        title,
        contentHtml: html,
        // 선택 박스의 한글 라벨 그대로 전송 (백엔드에서 정규화)
        categoryName: category, // "육아 꿀팁" or "경매"
        // files: []  // 에디터 내부 업로드 사용 시 굳이 안 보냄
      });

      setShowComplete(true);
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || "저장 실패");
    } finally {
      setSubmitting(false);
    }
  };

  /* ====== 렌더 ====== */
  if (initializing) {
    return (
      <div className="w-full max-w-5xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-7 w-1/3 rounded bg-gray-200" />
          <div className="h-10 w-full rounded bg-gray-200" />
          <div className="h-[420px] w-full rounded bg-gray-200" />
        </div>
      </div>
    );
  }

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
        {/* 카테고리 (🧷 수정 모드에서는 잠금) */}
        <div className="flex items-center gap-3">
          <label className="text-gray-700 text-sm w-20">카테고리</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-9 w-64 border rounded-md px-3 text-[13px] bg-white"
            disabled={submitting || isEdit} /* 🔒 수정 모드 비활성화 */
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

        {/* 에디터 (동일 UI 유지) */}
        <div className="border rounded-md">
          <Editor value={content} onChange={setContent} />
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
            {submitting ? (isEdit ? "수정 중..." : "작성 중...") : (isEdit ? "수정하기" : "작성하기")}
          </button>
        </div>
      </form>

      {/* 완료 모달 (작성/수정 공용) */}
      <ConfirmModal
        open={showComplete}
        title={isEdit ? "수정 완료" : "등록 완료"}
        message={isEdit ? "게시글이 수정되었습니다." : "게시글이 등록되었습니다."}
        onConfirm={() => {
          setShowComplete(false);
          // 작성은 목록으로, 수정은 상세로 이동하는게 자연스러워 보여서 이렇게 분기
          if (isEdit && postId) {
            router.push(`/post/${encodeURIComponent(postId)}?tab=${backTab}`);
          } else {
            router.push(`/post?tab=${backTab}`);
          }
        }}
        type={MODAL_TYPES.CONFIRM_ONLY}
        confirmText="확인"
      />
    </div>
  );
}
