"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { savePost, formatDate, loadPosts } from "../lib/postStorage";
import RegionDrawer from "../components/RegionDrawer";
import ConfirmModal, { MODAL_TYPES } from "@/components/common/ConfirmModal";


// 형제 폴더의 에디터
const Editor = dynamic(() => import("../components/Editor"), { ssr: false });

/* -----------------------------
   Storage helpers (카테고리/키)
----------------------------- */
const TYPE_FROM_CATEGORY = (category) => (category === "공동구매" ? "groupbuy" : "tips");
const KEY_FROM_TYPE = (type) => (type === "groupbuy" ? "posts:groupbuy" : "posts:tips");

function writeList(type, list) {
  if (typeof window === "undefined") return;
  const key = KEY_FROM_TYPE(type);
  localStorage.setItem(key, JSON.stringify(list));
}

function findPostById(id) {
  const all = [...loadPosts("tips"), ...loadPosts("groupbuy")];
  return all.find((p) => String(p.id) === String(id)) || null;
}

// participants 길이 안전 계산
function countParticipants(arr) {
  if (!Array.isArray(arr)) return 0;
  return arr.length;
}

export default function PostWritePage() {
  const router = useRouter();
  const sp = useSearchParams();

  const backTab = sp.get("tab") === "groupbuy" ? "groupbuy" : "tips";
  const idParam = sp.get("id");
  const isEdit = useMemo(() => Boolean(idParam), [idParam]);

  // 원본 포스트(수정 모드에서 참조)
  const originalRef = useRef(null);
  const originalPeopleRef = useRef(2); // 마감 시 변경 방지용 원본 인원 저장
  const [showEditCompleteModal, setShowEditCompleteModal] = useState(false);

  const [category, setCategory] = useState(
    backTab === "groupbuy" ? "공동구매" : "육아 꿀팁"
  );
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [people, setPeople] = useState(2); // 모집 인원
  const [region, setRegion] = useState(""); // 단일 지역
  const [regionDrawerOpen, setRegionDrawerOpen] = useState(false);

  const [currentJoinedCount, setCurrentJoinedCount] = useState(0); // 수정 모드용
  const [isClosed, setIsClosed] = useState(false); // 마감 여부

  const [loading, setLoading] = useState(isEdit);

  /* -----------------------------
     수정 모드 로딩
  ----------------------------- */
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

      setCategory(found.category || (backTab === "groupbuy" ? "공동구매" : "육아 꿀팁"));
      setTitle(found.title || "");
      setContent(found.content || "");

      // 현재 참여자 수
      const joined = countParticipants(found.participants);
      setCurrentJoinedCount(joined);

      // 원본 people(여러 키 지원) 계산
      const candidate =
        Number(found.people) ||
        Number(found.maxParticipants) ||
        Number(found.max) ||
        Number(found.capacity) ||
        Number(found.limit) ||
        Number(found.headcount) ||
        Number(found.count) ||
        Number(found.quota) ||
        2;

      const safePeople = Math.max(joined || 0, Number.isFinite(candidate) && candidate > 0 ? candidate : 2);
      setPeople(safePeople);
      originalPeopleRef.current = safePeople;

      // 지역(문자열/배열 모두 커버)
      setRegion(Array.isArray(found.region) ? (found.region[0] || "") : (found.region || ""));

      // 마감 여부: closed==true 또는 status !== "모집중"
      const closed = Boolean(found.closed) || (found.status && found.status !== "모집중");
      setIsClosed(closed);
    } finally {
      setLoading(false);
    }
  }, [isEdit, idParam, backTab, router]);

  const onCancel = () => router.push(`/post?tab=${backTab}`);

  /* -----------------------------
     저장 (작성/수정 공통)
  ----------------------------- */
  const onSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) return alert("제목을 입력해주세요.");
    if (!content.replace(/<[^>]*>/g, "").trim()) return alert("내용을 입력해주세요.");

    // 공동구매면 지역 필수
    if (category === "공동구매" && !region.trim()) {
      alert("공동구매 지역을 먼저 선택해주세요.");
      if (!isEdit) setRegionDrawerOpen(true); // 작성 중이면 드로어 열어줌
      return;
    }

    // 수정 모드에서: 현재 참여자 수보다 적게 줄일 수 없음 (마감 아닌 경우)
    if (isEdit && category === "공동구매" && !isClosed) {
      const joined = currentJoinedCount;
      if (people < joined) {
        alert(`현재 참여자 ${joined}명보다 적게 설정할 수 없습니다.`);
        return;
      }
    }

    // ===== 신규 작성 =====
    if (!isEdit) {
      const base = {
        id: Date.now(),
        title,
        writer: "홍길동",
        date: formatDate(new Date()),
        views: 0,
        likes: 0,
        comments: [], // 상세 페이지와 일치
        category,
        content,
      };

      const p = Number(people);
      const post =
        category === "공동구매"
          ? {
              ...base,
              status: "모집중",
              region: region || "",
              people: p,
              maxParticipants: p, // ★ 정원 동기화
            }
          : base;

      savePost(post);

      // 열려있는 상세/목록에 즉시 반영(선택)
      try {
        window.dispatchEvent(new CustomEvent("posts:changed", { detail: { id: post.id, action: "create" } }));
      } catch {}

      alert("작성되었습니다!");
      router.push(`/post?tab=${category === "공동구매" ? "groupbuy" : "tips"}`);
      return;
    }

    // ===== 수정 모드 =====
    const original = originalRef.current || {};
    const originalType = TYPE_FROM_CATEGORY(original.category);
    const nextType = TYPE_FROM_CATEGORY(category);

    // 보존 필드
    const preserved = {
      id: original.id,
      views: original.views || 0,
      likes: original.likes || 0,
      comments: Array.isArray(original.comments) ? original.comments : [],
      participants: Array.isArray(original.participants) ? original.participants : undefined,
      ownerDeviceId: original.ownerDeviceId,
      createdAt: original.createdAt,
      date: original.date,
      closed: original.closed,
      closedAt: original.closedAt,
      status: original.status,
      // 지역은 "수정에서 변경 불가" → 기존 값 유지
      region:
        typeof original.region === "string"
          ? original.region
          : Array.isArray(original.region)
          ? original.region[0] || ""
          : "",
    };

    // 수정 내용 반영
    const updatedCore = {
      ...original,
      ...preserved,
      title,
      content,
      category,
    };

    // people 최종값: 마감이면 원본값 강제 유지, 아니면 현재 people
    const peopleFinal =
      category === "공동구매"
        ? isClosed
          ? Number(originalPeopleRef.current)
          : Number(people)
        : undefined;

    let updatedPost;
    if (category === "공동구매") {
      updatedPost = {
        ...updatedCore,
        status: updatedCore.status || "모집중",
        people: peopleFinal,
        maxParticipants: peopleFinal, // ★ 정원 동기화
        // region은 preserved 값 사용(수정 불가)
      };
    } else {
      // 꿀팁으로 바꾸면 공동구매 전용 필드 정리
      const { status, participants, people: _p, maxParticipants: _mp, region: _r, closed, closedAt, ...rest } =
        updatedCore;
      updatedPost = { ...rest };
    }

    // 리스트 갱신 (카테고리 변경 대응)
    if (originalType === nextType) {
      const list = loadPosts(nextType);
      const idx = list.findIndex((p) => String(p.id) === String(updatedPost.id));
      const nextList = [...list];
      if (idx >= 0) nextList[idx] = updatedPost;
      else nextList.unshift(updatedPost);
      writeList(nextType, nextList);
    } else {
      const fromList = loadPosts(originalType).filter((p) => String(p.id) !== String(updatedPost.id));
      writeList(originalType, fromList);
      const toList = [updatedPost, ...loadPosts(nextType)];
      writeList(nextType, toList);
    }

    // 열려있는 상세/목록에 즉시 반영(선택)
    try {
      window.dispatchEvent(new CustomEvent("posts:changed", { detail: { id: updatedPost.id, action: "update" } }));
    } catch {}

    setShowEditCompleteModal(true);
  };

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

  // 드롭다운 최소 모집 인원: (수정+공동구매)에서는 현재 참여자 수 이상
  const minSelectablePeople = isEdit && category === "공동구매" ? Math.max(2, currentJoinedCount) : 2;

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      {/* CKEditor 입력영역 높이 고정 (전역 적용) */}
      <style jsx global>{`
        .ck-editor__editable {
          min-height: 400px !important;
          max-height: 400px !important;
          overflow-y: auto !important;
        }
        .ck.ck-editor {
          width: 100%;
        }
      `}</style>

      <form onSubmit={onSubmit} className="space-y-5">
        {/* 카테고리 */}
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

        {/* 제목 + 공동구매 옵션 */}
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
              {/* 안내 문구 + 칩 */}
              <div className="hidden sm:flex items-center gap-2 text-[12px] text-gray-500">
                <span>공동 구매 지역은 변경이 불가능 합니다.</span>
                {region ? (
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-gray-700">
                    {region}
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-gray-400">
                    미선택
                  </span>
                )}
              </div>

              {/* 참여 인원 */}
              <div className="flex items-center gap-2 text-[12px]">
                <span className="text-gray-700">참여 인원</span>
                <select
                  value={people}
                  onChange={(e) => setPeople(Number(e.target.value))}
                  className={`h-7 border rounded-sm px-2 text-[12px] bg-white ${
                    isEdit && isClosed ? "cursor-not-allowed" : ""
                  }`}
                  title={
                    isEdit && isClosed
                      ? "마감된 모집은 인원 변경이 불가합니다."
                      : isEdit && currentJoinedCount > 0
                      ? `현재 참여자 ${currentJoinedCount}명 이상으로만 설정할 수 있습니다.`
                      : undefined
                  }
                  disabled={isEdit && isClosed}
                >
                  {Array.from({ length: 9 }, (_, i) => i + 2).map((n) => (
                    <option key={n} value={n} disabled={!isClosed && n < minSelectablePeople}>
                      {n}명{!isClosed && n < minSelectablePeople ? " (불가)" : ""}
                    </option>
                  ))}
                </select>
                {isEdit && (isClosed ? (
                  <span className="text-[11px] text-red-500">마감됨</span>
                ) : currentJoinedCount > 0 ? (
                  <span className="text-[11px] text-gray-500">최소 {currentJoinedCount}명</span>
                ) : null)}
              </div>

              {/* 지역 선택 버튼: 작성에서만 활성, 수정에서는 비활성 */}
              <button
                type="button"
                onClick={() => !isEdit && setRegionDrawerOpen(true)}
                disabled={isEdit}
                title={isEdit ? "수정 모드에서는 지역을 변경할 수 없습니다." : "지역 선택"}
                className={`h-7 px-3 rounded text-white text-[12px] ${
                  isEdit ? "bg-gray-300 cursor-not-allowed" : "cursor-pointer hover:brightness-95"
                }`}
                style={{ backgroundColor: isEdit ? undefined : "#65A2EE" }}
              >
                {region ? "지역 변경" : "지역 선택"}
              </button>
            </div>
          )}
        </div>

        {/* 에디터 (고정 높이) */}
        <div className="border rounded-sm">
          <Editor value={content} onChange={setContent} />
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-center gap-6 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="h-9 w-28 rounded border text-sm cursor-pointer hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            className="h-9 w-28 rounded text-white text-sm cursor-pointer hover:brightness-95"
            style={{ backgroundColor: "#65A2EE" }}
          >
            {isEdit ? "수정하기" : "작성하기"}
          </button>
        </div>
      </form>

      {/* 지역 선택 드로어 — Sidebar 동일 사이즈(600px) */}
      <RegionDrawer
        open={regionDrawerOpen}
        initial={region}
        onClose={() => setRegionDrawerOpen(false)}
        onSave={(picked) => setRegion(picked)}
        width={600}
      />

        <ConfirmModal
  open={showEditCompleteModal}
  title="수정 완료"
  message="게시글이 수정되었습니다."
  onConfirm={() => {
    setShowEditCompleteModal(false);
    router.push(`/post?tab=${category === "공동구매" ? "groupbuy" : "tips"}`);
  }}
  type={MODAL_TYPES.CONFIRM_ONLY}
  confirmText="확인"
/>
    </div>
    
  );
}
