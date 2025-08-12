"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loadPosts, removePost } from "../lib/postStorage";

/* -----------------------------
   Storage helpers
----------------------------- */
const TYPE_FROM_CATEGORY = (category) => (category === "공동구매" ? "groupbuy" : "tips");
const KEY_FROM_TYPE = (type) => (type === "groupbuy" ? "posts:groupbuy" : "posts:tips");

function getPostLocal(id) {
  if (typeof window === "undefined") return null;
  const all = [...loadPosts("tips"), ...loadPosts("groupbuy")];
  return all.find((p) => String(p.id) === String(id)) || null;
}

function updatePostLocal(nextPost) {
  if (typeof window === "undefined" || !nextPost) return;
  const type = TYPE_FROM_CATEGORY(nextPost.category);
  const key = KEY_FROM_TYPE(type);
  const list = loadPosts(type);
  const idx = list.findIndex((p) => String(p.id) === String(nextPost.id));
  if (idx === -1) return;
  const updated = [...list];
  updated[idx] = nextPost;
  localStorage.setItem(key, JSON.stringify(updated));
}

/* -----------------------------
   Device ID (owner 흉내)
----------------------------- */
function getOrCreateDeviceId() {
  if (typeof window === "undefined") return "ssr";
  const KEY = "device_id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = "dev-" + Math.random().toString(36).slice(2, 8) + "-" + Date.now().toString(36).slice(-6);
    localStorage.setItem(KEY, id);
  }
  return id;
}

/* -----------------------------
   Date utils (YYYY.MM.DD HH:mm)
----------------------------- */
function parseDateAny(v) {
  if (!v) return null;
  const d1 = new Date(v);
  if (!Number.isNaN(d1.getTime())) return d1;
  if (typeof v === "string" && v.includes(".")) {
    const m = v.replace(/\s/g, "").match(/^(\d{4})\.(\d{2})\.(\d{2})/);
    if (m) {
      const d2 = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
      if (!Number.isNaN(d2.getTime())) return d2;
    }
  }
  return null;
}
const pad2 = (n) => String(n).padStart(2, "0");
function formatDateTime(d) {
  if (!(d instanceof Date)) return "";
  return `${d.getFullYear()}.${pad2(d.getMonth() + 1)}.${pad2(d.getDate())} ${pad2(
    d.getHours()
  )}:${pad2(d.getMinutes())}`;
}

/* -----------------------------
   HTML sanitizer
----------------------------- */
function sanitize(html = "") {
  if (!html) return "";
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    doc.querySelectorAll("script, style, iframe").forEach((el) => el.remove());
    doc.querySelectorAll("*").forEach((el) => {
      [...el.attributes].forEach((attr) => {
        if (attr.name.toLowerCase().startsWith("on")) el.removeAttribute(attr.name);
      });
    });
    return doc.body.innerHTML;
  } catch {
    return html;
  }
}

/* 다양한 키명 → maxParticipants 통일 */
function extractMaxParticipants(p) {
  const candidates = [
    p?.maxParticipants,
    p?.max,
    p?.people,
    p?.capacity,
    p?.limit,
    p?.headcount,
    p?.count,
    p?.quota,
  ];
  for (const v of candidates) {
    const n = Number(v);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return 5;
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = useMemo(() => (params?.id ? String(params.id) : null), [params]);

  const deviceId = useMemo(() => getOrCreateDeviceId(), []);

  // state
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [joinedHere, setJoinedHere] = useState(false);
  const [lastJoinedName, setLastJoinedName] = useState("");

  // 모달
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // derived
  const backTab =
    searchParams.get("tab") ||
    (post?.category === "공동구매" ? "groupbuy" : "tips") ||
    "tips";
  const isGroupbuy = post?.category === "공동구매";
  const statusText = post?.status || "모집중";
  const participants = Array.isArray(post?.participants) ? post.participants : [];
  const maxParticipants = extractMaxParticipants(post || {});
  const isFull = participants.length >= maxParticipants;
  const isClosed = Boolean(post?.closed) || (post?.status && post.status !== "모집중");
  const isOwner = post?.ownerDeviceId === deviceId;

  /* ---------------------------------
     hooks (항상 같은 순서)
  ----------------------------------*/
  const bumpViewOnce = useCallback((p) => {
    if (!p) return;
    try {
      const key = `viewed_${p.id}`;
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
        const next = { ...p, views: (p.views || 0) + 1 };
        updatePostLocal(next);
        setPost(next);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const found = getPostLocal(id);
      if (!found) {
        setError("게시글을 찾을 수 없습니다.");
        setPost(null);
      } else {
        let dirty = false;

        if (found.category === "공동구매") {
          const writer = found.author || found.writer || "익명";
          const arr = Array.isArray(found.participants) ? [...found.participants] : [];
          if (!arr.includes(writer)) {
            found.participants = [writer, ...arr];
            dirty = true;
          }
          const max = extractMaxParticipants(found);
          if (Number(found.maxParticipants) !== max) {
            found.maxParticipants = max;
            dirty = true;
          }
          if (!found.ownerDeviceId) {
            found.ownerDeviceId = deviceId;
            dirty = true;
          }
        }

        if (dirty) updatePostLocal(found);

        setPost(found);
        setLikes(found.likes || 0);
        setComments(Array.isArray(found.comments) ? found.comments : []);
        bumpViewOnce(found);
      }
    } catch {
      setError("게시글을 불러오는 중 오류가 발생했습니다.");
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [id, bumpViewOnce, deviceId]);

  const onDelete = useCallback(() => {
    if (!post) return;
    if (!confirm("정말로 삭제하시겠어요? 되돌릴 수 없습니다.")) return;
    try {
      const type = TYPE_FROM_CATEGORY(post.category);
      if (typeof removePost === "function") removePost(type, post.id);
      try {
        window.dispatchEvent(
          new CustomEvent("posts:changed", { detail: { id: post.id, action: "delete" } })
        );
      } catch {}
      router.push(`/post?tab=${backTab}`);
    } catch {
      alert("삭제 중 오류가 발생했습니다.");
    }
  }, [post, router, backTab]);

  const onEdit = useCallback(() => {
    if (!post) return;
    router.push(`/post/write?id=${post.id}&tab=${backTab}`);
  }, [post, router, backTab]);

  const onCopyUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("URL이 복사되었습니다.");
    } catch {
      alert("URL 복사에 실패했어요.");
    }
  }, []);

  const onToggleLike = useCallback(() => {
    if (!post) return;
    const nextLikes = likes + 1;
    setLikes(nextLikes);
    const next = { ...post, likes: nextLikes };
    setPost(next);
    updatePostLocal(next);
  }, [likes, post]);

  const onAddComment = useCallback(() => {
    if (!post) return;
    const text = commentInput.trim();
    if (!text) return;
    const newC = {
      id: Date.now(),
      author: "익명맘",
      content: text,
      createdAt: new Date().toISOString(),
    };
    const nextComments = [...comments, newC];
    setComments(nextComments);
    setCommentInput("");
    const next = { ...post, comments: nextComments };
    setPost(next);
    updatePostLocal(next);
    try {
      window.dispatchEvent(
        new CustomEvent("posts:changed", { detail: { id: post.id, action: "comment" } })
      );
    } catch {}
  }, [commentInput, comments, post]);

  // 참여
  const onJoin = useCallback(() => {
    if (!post || isFull || isClosed) return;
    const name = prompt("참여자 이름을 입력하세요:");
    if (!name) return;

    const names = participants.map((x) => (typeof x === "string" ? x : x?.name || ""));
    if (names.includes(name)) {
      alert("이미 참여한 이름입니다.");
      return;
    }

    const addValue =
      participants.length && typeof participants[0] === "string"
        ? name
        : { name, joinedAt: new Date().toISOString() };

    const next = { ...post, participants: [...participants, addValue] };
    setPost(next);
    setJoinedHere(true);
    setLastJoinedName(name);
    updatePostLocal(next);
    try {
      window.dispatchEvent(
        new CustomEvent("posts:changed", { detail: { id: post.id, action: "join" } })
      );
    } catch {}
  }, [post, participants, isFull, isClosed]);

  // 참여자 명단 보기 → 모달 오픈
  const onShowParticipants = useCallback(() => {
    setShowListModal(true);
  }, []);

  // 참여 취소 (확인 모달에서 최종 수행)
  const onCancelJoin = useCallback(() => {
    if (!post || !joinedHere || isOwner) return;
    const names = participants.map((x) => (typeof x === "string" ? x : x?.name || ""));
    if (!lastJoinedName || !names.includes(lastJoinedName)) return;

    const filtered = participants.filter((x) =>
      typeof x === "string" ? x !== lastJoinedName : x?.name !== lastJoinedName
    );
    const next = { ...post, participants: filtered };
    setPost(next);
    setJoinedHere(false);
    updatePostLocal(next);
    setShowCancelConfirm(false);
    setShowListModal(false);
    try {
      window.dispatchEvent(
        new CustomEvent("posts:changed", { detail: { id: post.id, action: "leave" } })
      );
    } catch {}
  }, [post, joinedHere, isOwner, lastJoinedName, participants]);

  // 실제 마감 처리
  const doCloseRecruitment = useCallback(() => {
    if (!post) return;
    const next = {
      ...post,
      closed: true,
      status: "모집완료",
      closedAt: new Date().toISOString(),
    };
    setPost(next);
    updatePostLocal(next);
    try {
      window.dispatchEvent(
        new CustomEvent("posts:changed", { detail: { id: post.id, action: "close" } })
      );
    } catch {}
  }, [post]);

  // 마감 버튼 클릭 → 모달 오픈
  const onCloseRecruitmentClick = useCallback(() => {
    if (!post) return;
    if (!isOwner) {
      alert("작성자(이 글의 소유 기기)만 마감할 수 있어요.");
      return;
    }
    if (isClosed || participants.length < maxParticipants) return;
    setShowCloseModal(true);
  }, [post, isOwner, isClosed, participants.length, maxParticipants]);

  /* ----- early returns AFTER hooks ----- */
  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-2/3 rounded bg-gray-200" />
          <div className="h-4 w-1/3 rounded bg-gray-200" />
          <div className="h-64 w-full rounded-xl bg-gray-200" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </div>
        <div className="mt-6">
          <Link
            href="/post"
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
          >
            ← 목록으로
          </Link>
        </div>
      </div>
    );
  }

  const createdAt = parseDateAny(post?.createdAt) || parseDateAny(post?.date) || null;
  const writtenDateTime = createdAt ? formatDateTime(createdAt) : "";

  // 버튼 색
  const joinBtnColor = isClosed || isFull ? "#999999" : joinedHere ? "#65A2EE" : "#85B3EB";
  const closeBtnColor =
    participants.length < maxParticipants ? "#999999" : isClosed ? "#65A2EE" : "#85B3EB";

  // 참가자 이름/시간 정규화
  const normalized = (Array.isArray(participants) ? participants : []).map((x) => {
    if (typeof x === "string") {
      return { name: x, joinedAt: post?.createdAt || null };
    }
    return { name: x?.name || "", joinedAt: x?.joinedAt || post?.createdAt || null };
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* 상단 브레드크럼 + 우측 유틸 */}
      <div className="mb-2 flex items-center justify-between text-[13px] text-gray-500">
        <div className="space-x-2">
          <Link href={`/post?tab=${backTab}`} className="hover:underline">
            {backTab === "groupbuy" ? "공동구매" : "육아꿀팁"}
          </Link>
          <span className="text-gray-300">›</span>
          <span className="text-gray-400">상세</span>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={onEdit} className="text-gray-400 hover:text-gray-600 cursor-pointer" type="button">
            수정
          </button>
          <span className="text-gray-300">|</span>
          <button onClick={onDelete} className="text-gray-400 hover:text-red-500 cursor-pointer" type="button">
            삭제
          </button>
          <span className="text-gray-300">|</span>
          <a href="#comments" className="inline-flex items-center gap-1 hover:underline text-gray-700 cursor-pointer">
            <span className="inline-block w-5 h-5 text-[16px] leading-5">💬</span>
            <span className="text-[14px]">댓글 {comments.length}</span>
          </a>
          <span className="text-gray-300">|</span>
          <button
            onClick={onCopyUrl}
            className="inline-flex items-center gap-1 hover:underline text-gray-700 cursor-pointer"
          >
            <span className="inline-block w-5 h-5 text-[16px] leading-5">🔗</span>
            <span className="text-[14px]">url 복사</span>
          </button>
        </div>
      </div>

      {/* 제목/메타 */}
      <div className="pb-4 border-b">
        <h1 className="mb-1 text-[22px] font-semibold tracking-tight flex items-center gap-2">
          {isGroupbuy && (
            <span className={statusText === "모집중" ? "text-red-500" : "text-gray-400"}>
              {statusText}
            </span>
          )}
          <span>{post?.title || "(제목 없음)"}</span>
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <span>{post?.author || post?.writer || "익명"}</span>
          {writtenDateTime && (
            <>
              <span className="text-gray-300">·</span>
              <span>{writtenDateTime}</span>
            </>
          )}
          <span className="text-gray-300">·</span>
          <span>조회 {post?.views || 0}</span>
        </div>
      </div>

      {/* 본문 */}
      <article className="mb-8 mt-6 text-[15px] leading-7 text-gray-800">
        <div dangerouslySetInnerHTML={{ __html: sanitize(post?.content || "") }} />
        {Array.isArray(post?.images) && post.images.length > 0 && (
          <div className="mt-6">
            <img
              src={post.images[0]}
              alt="post-image"
              className="w-full max-w-xl rounded-md border object-cover"
            />
          </div>
        )}
      </article>

      {/* 공동구매 전용: 참여/마감/명단 (작성자/비작성자에 따라 한 개만 노출) */}
      {isGroupbuy && (
        <div className="mb-8">
          {isOwner ? (
            /* 작성자: '참여 마감'만 */
            <div className="flex justify-center">
              <button
                onClick={onCloseRecruitmentClick}
                disabled={isClosed || participants.length < maxParticipants}
                className={`px-8 py-3 rounded-md text-white font-medium ${
                  isClosed || participants.length < maxParticipants
                    ? "cursor-not-allowed"
                    : "cursor-pointer hover:brightness-95"
                }`}
                style={{ backgroundColor: closeBtnColor }}
                title={
                  participants.length < maxParticipants
                    ? "정원 충족 시 마감할 수 있어요"
                    : isClosed
                    ? "이미 마감됨"
                    : ""
                }
              >
                참여 마감
                <div className="text-xs opacity-90 mt-1">
                  {participants.length} / {maxParticipants}
                </div>
              </button>
            </div>
          ) : (
            /* 작성자 아님: '참여하기'만 */
            <div className="flex justify-center">
              <button
                onClick={onJoin}
                disabled={isClosed || isFull}
                className={`px-8 py-3 rounded-md text-white font-medium ${
                  isClosed || isFull ? "cursor-not-allowed" : "cursor-pointer hover:brightness-95"
                }`}
                style={{ backgroundColor: joinBtnColor }}
                title={isClosed ? "마감된 모집입니다" : isFull ? "정원이 가득 찼습니다" : ""}
              >
                참여하기
                <div className="text-xs opacity-90 mt-1">
                  {participants.length} / {maxParticipants}
                </div>
              </button>
            </div>
          )}

          {/* 참여자 명단 (모두에게 노출) */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onShowParticipants}
              className="text-xs text-gray-500 hover:underline cursor-pointer"
              type="button"
            >
              참여자 명단
            </button>
          </div>
        </div>
      )}

      {/* 좋아요/댓글 바 */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-6 text-sm text-gray-700">
          <button onClick={onToggleLike} className="group inline-flex items-center gap-1 cursor-pointer">
            <span>❤️</span>
            <span>좋아요 {likes}</span>
          </button>
        <a href="#comments" className="inline-flex items-center gap-1 cursor-pointer">
            <span>💬</span>
            <span>댓글 {comments.length}</span>
          </a>
        </div>
        <Link
          href={`/post?tab=${backTab}`}
          className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
        >
          목록
        </Link>
      </div>

      <div className="h-px w-full bg-gray-200" />

      {/* 댓글 리스트 */}
      <section id="comments" className="mt-6">
        {comments.length > 0 ? (
          <ul className="space-y-6">
            {comments.map((c) => {
              const d = parseDateAny(c.createdAt);
              const when = d ? formatDateTime(d) : "";
              return (
                <li key={c.id} className="flex gap-3">
                  <div className="mt-1 h-8 w-8 flex-none rounded-full bg-gray-200 text-center leading-8 text-gray-600">
                    {c.author?.[0] || "익"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 text-sm text-gray-500">
                      <span className="font-medium text-gray-700">{c.author || "익명"}</span>
                      {when && (
                        <>
                          <span className="mx-2 text-gray-300">·</span>
                          <span>{when}</span>
                        </>
                      )}
                    </div>
                    <div className="whitespace-pre-wrap text-[15px] leading-7 text-gray-800">
                      {c.content}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-sm text-gray-500">아직 댓글이 없어요.</div>
        )}
      </section>

      {/* 댓글 입력 */}
      <div className="mt-8 rounded-2xl border bg-white p-4 shadow-sm">
        <div className="mb-3 text-sm font-medium text-gray-700">의견을 남겨보세요</div>
        <div className="flex items-end gap-2">
          <textarea
            className="min-h-[44px] w-full resize-none rounded-xl border px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-gray-200"
            placeholder="댓글을 작성하여 게시글에 참여해보세요 !"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
          />
          <button
            onClick={onAddComment}
            className="h-10 shrink-0 rounded-xl bg-black px-4 text-sm font-medium text-white hover:opacity-90 cursor-pointer"
          >
            등록
          </button>
        </div>
      </div>

      {/* ===== 참여 마감 확인 모달 ===== */}
      {showCloseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[460px] rounded-3xl bg-white p-8 shadow-xl">
            <h3 className="text-center text-2xl font-bold mb-4">메시지</h3>
            <p className="text-center mb-6">
              공동구매 인원모집을<br />마감 하시겠습니까?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowCloseModal(false)}
                className="h-12 w-36 rounded-xl border border-gray-300 bg-white text-gray-400 cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={() => { setShowCloseModal(false); doCloseRecruitment(); }}
                className="h-12 w-36 rounded-xl text-white hover:brightness-95 cursor-pointer"
                style={{ backgroundColor: "#85B3EB" }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== 참여자 명단 모달 (크기 고정) ===== */}
      {showListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[460px] h-[520px] max-w-[90vw] rounded-3xl bg-white p-6 shadow-xl flex flex-col">
            {/* 헤더 */}
            <div className="mb-2 flex items-start justify-between">
              <div className="w-full text-center">
                <div className="text-[18px] font-semibold leading-tight">공동 구매</div>
                <div className="text-[18px] font-semibold leading-tight">참여자 명단</div>
              </div>
              <button
                onClick={() => setShowListModal(false)}
                className="ml-2 text-xl leading-none text-gray-500 hover:text-gray-700 cursor-pointer"
                aria-label="close"
              >
                ×
              </button>
            </div>

            {/* 리스트 (스크롤) */}
            <ul className="mt-4 mb-6 space-y-3 overflow-y-auto">
              {normalized.map((p, idx) => {
                const when = p.joinedAt ? formatDateTime(parseDateAny(p.joinedAt) || new Date()) : "";
                const isCrowned = idx === 0;
                return (
                  <li key={`${p.name}-${idx}`} className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      {isCrowned && <span className="text-sm">👑</span>}
                      <span className="text-[15px]">{p.name}</span>
                    </div>
                    <div className="text-[13px] text-gray-500 tabular-nums">{when}</div>
                  </li>
                );
              })}
            </ul>

            {/* 하단 버튼: 작성자 제외 & 내가 참여했을 때만 */}
            {!isOwner && joinedHere && (
              <div className="mt-auto flex justify-center">
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="h-12 w-36 rounded-xl text-white hover:brightness-95 cursor-pointer"
                  style={{ backgroundColor: "#85B3EB" }}
                >
                  참여 취소
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== 참여 취소 확인 모달 ===== */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[460px] rounded-3xl bg-white p-8 shadow-xl">
            <h3 className="text-center text-2xl font-bold mb-4">메시지</h3>
            <div className="text-center text-[14px] leading-6 text-gray-700 mb-6">
              공동 구매 참여를 취소 하시겠습니까 ?<br />
              공동구매 참여를 취소 할 시 같은 공동구매를 재참여 할 수 없습니다.
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="h-12 w-36 rounded-xl border border-gray-300 bg-white text-gray-400 cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={onCancelJoin}
                className="h-12 w-36 rounded-xl text-white hover:brightness-95 cursor-pointer"
                style={{ backgroundColor: "#85B3EB" }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
