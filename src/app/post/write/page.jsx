"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { loadPosts, formatDate } from "../lib/postStorage";
import ConfirmModal, { MODAL_TYPES } from "@/components/common/ConfirmModal";

// CKEditor는 클라 전용으로 로드
const Editor = dynamic(() => import("../components/Editor"), { ssr: false });

/* ── Storage helpers ─────────────────────────────────────────────── */
const TYPE_FROM_CATEGORY = (category) => (category === "경매" ? "auction" : "tips");
const KEY_FROM_TYPE = (type) => (type === "auction" ? "posts:auction" : "posts:tips");

function readList(type) {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY_FROM_TYPE(type)) || "[]"); } catch { return []; }
}
function writeList(type, list) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY_FROM_TYPE(type), JSON.stringify(list));
}
function findPostById(id) {
  const all = [
    ...(loadPosts("tips") || []),
    ...(readList("auction") || []),
    ...(loadPosts("groupbuy") || []),
  ];
  return all.find((p) => String(p.id) === String(id)) || null;
}

/* ── 경매 보조 ───────────────────────────────────────────────────── */
const MIN_START_PRICE = 5000;
const clampInt = (v, min, max) => Math.max(min, Math.min(max, Number.isFinite(+v) ? +v : min));
const onlyDigits = (s) => String(s || "").replace(/[^\d]/g, "");
function calcDaysFromEndTime(endTime) {
  if (!endTime) return 1;
  const diff = Math.ceil((new Date(endTime).getTime() - Date.now()) / (24 * 3600e3));
  return clampInt(diff, 1, 7);
}
function normalizeAuctionStatus(s) {
  if (!s) return "진행중";
  const x = String(s).toUpperCase();
  if (x.includes("CLOSED") || x.includes("완료") || x.includes("모집완료")) return "경매완료";
  return "진행중";
}

/* ── 리치텍스트 '내용 없음' 판별 ──────────────────────────────────── */
function isEmptyRichText(html) {
  if (typeof html !== "string" || html.trim() === "") return true;
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const text = (doc.body.textContent || "")
      .replace(/\u200B/g, "")    // zero-width
      .replace(/\u00A0/g, " ")   // &nbsp;
      .trim();
    if (text.length > 0) return false;
    if (doc.querySelector("img,video,iframe,embed,object,table,figure img")) return false;
    return true;
  } catch {
    return !html.replace(/<[^>]*>/g, "").trim();
  }
}

/* ================================================================= */

export default function PostWritePage() {
  const router = useRouter();
  const sp = useSearchParams();

  const backTab = sp.get("tab") === "auction" ? "auction" : "tips";
  const idParam = sp.get("id");
  const isEdit = useMemo(() => Boolean(idParam), [idParam]);

  const originalRef = useRef(null);
  const [showEditCompleteModal, setShowEditCompleteModal] = useState(false);

  // 공통
  const [category, setCategory] = useState(backTab === "auction" ? "경매" : "육아 꿀팁");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 경매 전용
  const [auctionDays, setAuctionDays] = useState(1); // 1~7일
  const [startPrice, setStartPrice] = useState(String(MIN_START_PRICE));

  const [loading, setLoading] = useState(isEdit);

  /* ── 수정 모드 로드 ───────────────────────────────────────────── */
  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    try {
      const found = findPostById(idParam);
      if (!found) {
        alert("수정할 게시글을 찾을 수 없습니다.");
        router.push(`/post?tab=${backTab}`);
        return;
      }
      originalRef.current = found;

      setCategory(found.category === "경매" ? "경매" : "육아 꿀팁");
      setTitle(found.title || "");
      setContent(found.content || "");

      if (found.category === "경매" || found.category === "공동구매") {
        const sp = Math.max(MIN_START_PRICE, Number(found.startingPrice) || MIN_START_PRICE);
        setStartPrice(String(sp));
        setAuctionDays(calcDaysFromEndTime(found.endTime));
      }
    } finally {
      setLoading(false);
    }
  }, [isEdit, idParam, backTab, router]);

  /* ── 저장 ─────────────────────────────────────────────────────── */
  const onCancel = () => router.push(`/post?tab=${backTab}`);

  const onSubmit = (e) => {
    e.preventDefault();

    // ⚠️ CKEditor IME/합성 타이밍 이슈 대비: 라이브 DOM에서 한번 더 읽어오기 폴백
    let html = content;
    try {
      const live = document.querySelector(".ck-editor__editable")?.innerHTML || "";
      if (!html || isEmptyRichText(html)) {
        if (live) html = live;
      }
    } catch {}

    if (!title.trim()) return alert("제목을 입력해주세요.");
    if (isEmptyRichText(html)) {
      alert("내용을 입력해주세요.");
      return;
    }

    const now = new Date();
    const base = {
      id: isEdit && originalRef.current ? originalRef.current.id : Date.now(),
      title,
      writer: "홍길동",
      date: formatDate(now),
      createdAt: (isEdit && originalRef.current?.createdAt) || now.toISOString(),
      views: (isEdit && originalRef.current?.views) || 0,
      likes: (isEdit && originalRef.current?.likes) || 0,
      comments:
        (isEdit && Array.isArray(originalRef.current?.comments) ? originalRef.current.comments : []) || [],
      category,
      content: html, // ← 폴백 반영된 최신 HTML 저장
    };

    let postToSave;

    if (category === "경매") {
      const parsedPrice = Number(onlyDigits(startPrice));
      if (!Number.isFinite(parsedPrice) || parsedPrice < MIN_START_PRICE) {
        alert(`경매 시작가는 최소 ${MIN_START_PRICE.toLocaleString()}원 입니다.`);
        return;
      }
      const days = clampInt(auctionDays, 1, 7);

      const endTime =
        isEdit && originalRef.current?.endTime
          ? originalRef.current.endTime
          : new Date(now.getTime() + days * 24 * 3600e3).toISOString();

      const status =
        isEdit && originalRef.current
          ? normalizeAuctionStatus(originalRef.current.status)
          : "진행중";

      postToSave = {
        ...base,
        category: "경매",
        startingPrice: parsedPrice,
        minIncrement: 1000,
        endTime,
        bids: (isEdit && Array.isArray(originalRef.current?.bids) ? originalRef.current.bids : []) || [],
        status,
      };
    } else {
      postToSave = { ...base, category: "육아 꿀팁" };
    }

    const nextType = TYPE_FROM_CATEGORY(postToSave.category);
    const originalType = isEdit ? TYPE_FROM_CATEGORY(originalRef.current?.category) : nextType;

    if (isEdit && originalType !== nextType) {
      const fromList = originalType === "auction" ? readList("auction") : loadPosts("tips") || [];
      const removed = (fromList || []).filter((p) => String(p.id) !== String(postToSave.id));
      originalType === "auction" ? writeList("auction", removed) : writeList("tips", removed);

      const toList = nextType === "auction" ? readList("auction") : loadPosts("tips") || [];
      nextType === "auction"
        ? writeList("auction", [postToSave, ...(toList || [])])
        : writeList("tips", [postToSave, ...(toList || [])]);
    } else {
      const list = nextType === "auction" ? readList("auction") : loadPosts("tips") || [];
      const idx = (list || []).findIndex((p) => String(p.id) === String(postToSave.id));
      const nextList = [...(list || [])];
      if (idx >= 0) nextList[idx] = postToSave;
      else nextList.unshift(postToSave);
      nextType === "auction" ? writeList("auction", nextList) : writeList("tips", nextList);
    }

    try {
      window.dispatchEvent(
        new CustomEvent("posts:changed", { detail: { id: postToSave.id, action: isEdit ? "update" : "create" } })
      );
    } catch {}

    if (isEdit) {
      setShowEditCompleteModal(true);
    } else {
      alert("작성되었습니다!");
      router.push(`/post?tab=${nextType === "auction" ? "auction" : "tips"}`);
    }
  };

  /* ── UI ────────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-7 w-1/3 rounded bg-gray-200" />
          <div className="h-9 w-2/3 rounded bg-gray-200" />
          <div className="h-10 w-1/2 rounded bg-gray-200" />
          <div className="h-64 w-full rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <style jsx global>{`
        .ck-editor__editable { min-height: 420px !important; max-height: 420px !important; overflow-y: auto !important; }
        .ck.ck-editor { width: 100%; }
      `}</style>

      <form onSubmit={onSubmit} className="space-y-5">
        {/* 카테고리 */}
        <div className="flex items-center gap-3">
          <label className="text-gray-700 text-sm w-20">카테고리</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-9 w-64 border rounded-md px-3 text-[13px] bg-white"
          >
            <option>경매</option>
            <option>육아 꿀팁</option>
          </select>
        </div>

        {/* 제목 + 경매 옵션 */}
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-gray-700 text-sm w-20">제목</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요.."
            className="h-10 flex-1 min-w-[280px] border rounded-md px-3 text-[13px]"
          />

          {category === "경매" && (
            <>
              <p className="text-xs text-gray-500 leading-5 max-w-[220px]">경매 시작 최소 금액은 5,000 원 입니다.</p>

              <div className="flex items-center gap-2 text-[12px]">
                <span className="text-gray-700">경매 일수</span>
                <select
                  value={auctionDays}
                  onChange={(e) => setAuctionDays(clampInt(e.target.value, 1, 7))}
                  className="h-8 w-20 border rounded-md px-2 bg-white text-sm"
                >
                  {Array.from({ length: 7 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n}일</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 text-[12px]">
                <span className="text-gray-700">경매 시작가</span>
                <div className="flex items-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={startPrice}
                    onChange={(e) => setStartPrice(onlyDigits(e.target.value))}
                    onBlur={() => {
                      const n = Number(onlyDigits(startPrice));
                      setStartPrice(String(Math.max(MIN_START_PRICE, Number.isFinite(n) ? n : MIN_START_PRICE)));
                    }}
                    placeholder="5000"
                    className="h-8 w-28 border rounded-md px-3 text-right text-sm"
                  />
                  <span className="ml-2 text-sm">원</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 에디터 */}
        <div className="border rounded-md">
          <Editor value={content} onChange={setContent} />
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-center gap-6 pt-4">
          <button type="button" onClick={onCancel} className="h-10 w-28 rounded-md border text-sm hover:bg-gray-50">
            취소
          </button>
          <button
            type="submit"
            className="h-10 w-28 rounded-md text-white text-sm hover:brightness-95"
            style={{ backgroundColor: "#65A2EE" }}
          >
            {isEdit ? "수정하기" : "작성하기"}
          </button>
        </div>
      </form>

      <ConfirmModal
        open={showEditCompleteModal}
        title="수정 완료"
        message="게시글이 수정되었습니다."
        onConfirm={() => {
          setShowEditCompleteModal(false);
          const nextType = TYPE_FROM_CATEGORY(category);
          router.push(`/post?tab=${nextType === "auction" ? "auction" : "tips"}`);
        }}
        type={MODAL_TYPES.CONFIRM_ONLY}
        confirmText="확인"
      />
    </div>
  );
}
