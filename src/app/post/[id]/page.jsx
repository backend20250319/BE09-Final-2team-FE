"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ConfirmModal, { MODAL_TYPES } from "@/components/common/ConfirmModal";
import { postAPI } from "@/lib/api";

/* =========================
   Utils
========================= */
function getOrCreateDeviceId() {
  if (typeof window === "undefined") return "ssr";
  const KEY = "device_id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id =
      "dev-" +
      Math.random().toString(36).slice(2, 8) +
      "-" +
      Date.now().toString(36).slice(-6);
    localStorage.setItem(KEY, id);
  }
  return id;
}
const norm = (s) => String(s || "").trim();
const isAuctionCat = (c) =>
  norm(c) === "경매" || String(c).toLowerCase() === "auction";

function sanitize(html = "") {
  if (!html) return "";
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    doc.querySelectorAll("script, style, iframe").forEach((el) => el.remove());
    doc.querySelectorAll("*").forEach((el) => {
      [...el.attributes].forEach((attr) => {
        if (attr.name.toLowerCase().startsWith("on"))
          el.removeAttribute(attr.name);
      });
    });
    return doc.body.innerHTML;
  } catch {
    return html;
  }
}

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
  return `${d.getFullYear()}.${pad2(d.getMonth() + 1)}.${pad2(
    d.getDate()
  )} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}
const nowISO = () => new Date().toISOString();

/* ===== Auction helpers ===== */
function useCountdown(endTime) {
  const [ms, setMs] = useState(() =>
    Math.max(0, new Date(endTime).getTime() - Date.now())
  );
  useEffect(() => {
    const t = setInterval(
      () => setMs(Math.max(0, new Date(endTime).getTime() - Date.now())),
      1000
    );
    return () => clearInterval(t);
  }, [endTime]);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return {
    ms,
    h,
    m,
    s,
    label: ms === 0 ? "경매 종료" : `${h}시간${m}분${s}초`,
  };
}
const bidListOf = (p) => (Array.isArray(p?.bids) ? p.bids : []);
const currentPriceOf = (p) => {
  const bids = bidListOf(p);
  if (!bids.length) return Number(p?.startingPrice ?? 0) || 0;
  return Number(bids[bids.length - 1].price) || 0;
};
const isAuctionClosed = (p) => {
  if (!p) return false;
  const st = String(p.status || "");
  if (st.includes("완료") || st.toUpperCase() === "CLOSED") return true;
  if (p.endTime) return new Date(p.endTime).getTime() <= Date.now();
  return false;
};

/* =========================
   Component
========================= */
export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = useMemo(() => (params?.id ? String(params.id) : null), [params]);

  const deviceId = useMemo(() => getOrCreateDeviceId(), []);

  // ---------- state ----------
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [deleteTargetCommentId, setDeleteTargetCommentId] = useState(null);
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);

  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");

  // groupbuy (옵션)
  const [joinedHere, setJoinedHere] = useState(false);
  const [lastJoinedName, setLastJoinedName] = useState("");
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);

  // auction
  const [bidInput, setBidInput] = useState("");

  // ---------- derived ----------
  const backTab = useMemo(() => {
    const q = searchParams.get("tab");
    if (q === "auction") return "auction";
    if (q === "groupbuy") return "groupbuy";
    if (isAuctionCat(post?.category)) return "auction";
    if (norm(post?.category) === "공동구매") return "groupbuy";
    return "tips";
  }, [searchParams, post]);

  const isAuction =
    isAuctionCat(post?.category) || searchParams.get("tab") === "auction";
  const isGroupbuy = norm(post?.category) === "공동구매";

  const participants = Array.isArray(post?.participants)
    ? post.participants
    : [];
  const maxParticipants = Number(post?.maxParticipants || 5);
  const isFull = participants.length >= maxParticipants;
  const isClosedRecruit =
    Boolean(post?.closed) || (post?.status && post.status !== "모집중");
  const isOwner = post?.ownerDeviceId === deviceId;

  /* ---------- load (from API) ---------- */
  const fetchPost = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      // postAPI.getPost(id) => ApiResponse.data => { post, comments, like }
      const payload = await postAPI.getPost(id);
      const p =
        payload.data.data?.post ||
        payload.data?.data?.post ||
        payload?.data?.data; // 안전장치

      const normalized = {
        ...p,
        content: p?.contentHtml ?? p?.content ?? "", // 본문 키 보정
        category:
          p?.category ?? (p?.type ? String(p.type).toLowerCase() : undefined),
        writer: p?.nickName ?? p?.userId ?? [],
        bids: Array.isArray(p?.bids) ? p.bids : [],
        images: Array.isArray(p?.images) ? p.images : [],
        date: payload?.data?.timestamp ?? [],
      };

      setPost(normalized);
      setLikes(payload?.data?.data?.like?.likeCount ?? 0);
      setComments(
        Array.isArray(payload.data.data?.comments)
          ? payload.data.data.comments
          : []
      );
    } catch (e) {
      console.error(e);
      setError("게시글을 불러오지 못했습니다.");
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  /* ---------- actions (현재 백엔드 미구현: 알림/낙관적 UI 처리) ---------- */
  const onDelete = useCallback(
    async () => {
      // alert("서버에 삭제 API가 아직 없어요. 백엔드 준비되면 연결할게요!");
      // 준비 후:
      await postAPI.deletePost(post.id);
      // router.push(`/post?tab=${backTab}`);
    },
    [
      /* post, router, backTab */
    ]
  );

  const onEdit = useCallback(() => {
    if (!post) return;
    router.push(`/post/write?id=${post.id}&tab=${backTab}`);
  }, [post, router, backTab]);

  const onCopyUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
    } catch {
      alert("URL 복사에 실패했어요.");
    }
  }, []);

  const onToggleLike = useCallback(async () => {
    if (!post) return;
    // 서버 미구현 → 로컬 토글만
    setLikes((v) => (v > 0 ? 0 : 1));
    // 준비 후:
    // if (nextLikes > 0) await postAPI.like(post.id);
    // else await postAPI.unlike(post.id);
  }, [post]);

  const onAddComment = useCallback(async () => {
    if (!post) return;
    const text = commentInput.trim();
    if (!text) return;

    // 서버 미구현 → 로컬로만 추가
    const newC = {
      id: Date.now(),
      author: "익명맘",
      content: text,
      createdAt: nowISO(),
    };
    setComments((prev) => [...prev, newC]);
    setCommentInput("");

    // 준비 후:
    // const saved = await postAPI.addComment(post.id, { content: text });
    // setComments((prev) => [...prev, saved]);
  }, [commentInput, post]);

  const onDeleteComment = useCallback(
    async (commentId) => {
      if (!post) return;
      // 서버 미구현 → 로컬 삭제
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      // 준비 후: await postAPI.deleteComment(post.id, commentId);
    },
    [post]
  );

  // groupbuy (옵션)
  const onJoin = useCallback(async () => {
    if (!post || isFull || isClosedRecruit) return;
    alert("공동구매 참여 API 미구현 상태입니다.");
    // 준비 후:
    // const name = `익명맘-${deviceId.slice(-4)}`;
    // await postAPI.joinGroupbuy(post.id, { name });
    // setJoinedHere(true);
    // setLastJoinedName(name);
    // await fetchPost();
  }, [post, isFull, isClosedRecruit /*, deviceId, fetchPost */]);

  const onCancelJoin = useCallback(async () => {
    if (!post || !joinedHere || isOwner) return;
    alert("공동구매 참여취소 API 미구현 상태입니다.");
    // 준비 후:
    // await postAPI.cancelJoin(post.id);
    // setJoinedHere(false);
    // setShowListModal(false);
    // await fetchPost();
  }, [post, joinedHere, isOwner /*, fetchPost */]);

  const doCloseRecruitment = useCallback(async () => {
    if (!post) return;
    alert("공동구매 마감 API 미구현 상태입니다.");
    // 준비 후:
    // await postAPI.closeGroupbuy(post.id);
    // setShowCloseModal(false);
    // await fetchPost();
  }, [post /*, fetchPost */]);

  // auction
  const onBid = useCallback(async () => {
    if (!post) return;
    if (isAuctionClosed(post)) {
      alert("경매가 마감되었습니다.");
      return;
    }
    const cur = currentPriceOf(post);
    const minNext = cur + 1;
    const nextPrice = Number(bidInput);
    if (!Number.isFinite(nextPrice) || nextPrice < minNext) {
      alert(`최소 입찰가는 ${minNext.toLocaleString()}원 입니다.`);
      return;
    }
    alert("입찰 API 미구현 상태입니다.");
    // 준비 후:
    // await postAPI.placeBid(post.id, { price: nextPrice });
    // setBidInput("");
    // await fetchPost();
  }, [post, bidInput /*, fetchPost */]);

  /* ---------- render ---------- */
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

  const createdAt =
    parseDateAny(post?.createdAt) || parseDateAny(post?.date) || null;
  const participantsCount = (Array.isArray(participants) ? participants : [])
    .length;
  const joinBtnColor =
    isClosedRecruit || isFull ? "#999999" : joinedHere ? "#65A2EE" : "#85B3EB";
  const closeBtnColor =
    participantsCount < maxParticipants
      ? "#999999"
      : isClosedRecruit
      ? "#65A2EE"
      : "#85B3EB";
  const normalizedParticipants = (
    Array.isArray(participants) ? participants : []
  ).map((x) =>
    typeof x === "string"
      ? { name: x, joinedAt: post?.createdAt || null }
      : {
          name: x?.name || "",
          joinedAt: x?.joinedAt || post?.createdAt || null,
        }
  );
  const auctionClosed = isAuctionClosed(post);
  const currentPrice = isAuction ? currentPriceOf(post) : 0;

  return (
    <>
      {/* 전역: number input 스피너 제거 */}
      <style jsx global>{`
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>

      {/* 토스트 */}
      {toastVisible && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 animate-fade-in-out rounded-lg bg-black text-white px-4 py-2 text-sm shadow-lg z-[9999]">
          URL이 복사되었습니다.
        </div>
      )}

      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* 상단 유틸 */}
        <div className="mb-2 flex items-center justify-between text-[13px] text-gray-500">
          <div className="space-x-2">
            <Link href={`/post?tab=${backTab}`} className="hover:underline">
              {backTab === "auction"
                ? "경매"
                : backTab === "groupbuy"
                ? "공동구매"
                : "육아꿀팁"}
            </Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-400">상세</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onEdit}
              className="text-gray-400 hover:text-gray-600"
              type="button"
            >
              수정
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => setShowDeletePostModal(true)}
              className="text-gray-400 hover:text-red-500"
              type="button"
            >
              삭제
            </button>
            <span className="text-gray-300">|</span>
            <a
              onClick={(e) => {
                e.preventDefault();
                document
                  .querySelector("#comments li")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="inline-flex items-center gap-1 hover:underline text-gray-700 cursor-pointer"
            >
              <span className="inline-block w-5 h-5 text-[16px] leading-5">
                💬
              </span>
              <span className="text-[14px]">댓글 {comments.length}</span>
            </a>
            <span className="text-gray-300">|</span>
            <button
              onClick={onCopyUrl}
              className="inline-flex items-center gap-1 hover:underline text-gray-700"
            >
              <span className="inline-block w-5 h-5 text-[16px] leading-5">
                🔗
              </span>
              <span className="text-[14px]">url 복사</span>
            </button>
          </div>
        </div>

        {/* 제목/메타 */}
        <div className="pb-4 border-b">
          <h1 className="mb-1 text-[22px] font-semibold tracking-tight flex items-center gap-2">
            {isGroupbuy && (
              <span
                className={
                  post?.status === "모집중" ? "text-red-500" : "text-gray-400"
                }
              >
                {post?.status || "모집중"}
              </span>
            )}
            {isAuction && (
              <span
                className={auctionClosed ? "text-gray-400" : "text-red-500"}
              >
                {auctionClosed ? "경매완료" : "진행중"}
              </span>
            )}
            <span>{post?.title || "(제목 없음)"}</span>
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span>{post?.author || post?.writer || "익명"}</span>
            {createdAt && (
              <>
                <span className="text-gray-300">·</span>
                <span>{formatDateTime(createdAt)}</span>
              </>
            )}
            <span className="text-gray-300">·</span>
            <span>조회 {post?.views || 0}</span>
          </div>
        </div>

        {/* 본문 */}
        <article className="mb-8 mt-6 text-[15px] leading-7 text-gray-800">
          <div
            dangerouslySetInnerHTML={{ __html: sanitize(post?.content || "") }}
          />
          {Array.isArray(post?.images) && post.images.length > 0 && (
            <div className="mt-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.images[0]}
                alt="post-image"
                className="w-full max-w-xl rounded-md border object-cover"
              />
            </div>
          )}
        </article>

        {/* 경매 영역 */}
        {isAuction && (
          <AuctionHeader
            endTime={post.endTime}
            status={post.status}
            currentPrice={currentPrice}
            minNext={(currentPrice || 0) + 1} // 현재가 + 1원
            onBid={onBid}
            bidInput={bidInput}
            setBidInput={setBidInput}
            bids={bidListOf(post)}
          />
        )}

        {/* 좋아요/댓글 바 */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm text-gray-700">
            <button
              onClick={onToggleLike}
              className="group inline-flex items-center gap-1"
            >
              <span className="text-[18px] leading-5">
                {likes > 0 ? "❤️" : "♡"}
              </span>
              <span>좋아요 {likes}</span>
            </button>
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
                      <div className="mb-1 flex items-center justify-between text-sm text-gray-500">
                        <div>
                          <span className="font-medium text-gray-700">
                            {c.author || "익명"}
                          </span>
                          {when && (
                            <>
                              <span className="mx-2 text-gray-300">·</span>
                              <span>{when}</span>
                            </>
                          )}
                        </div>
                        <button
                          onClick={() => setDeleteTargetCommentId(c.id)}
                          className="text-xs text-gray-400 hover:text-red-500"
                        >
                          삭제
                        </button>
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

          {/* 댓글 삭제 확인 모달 */}
          <ConfirmModal
            open={!!deleteTargetCommentId}
            title="댓글 삭제"
            message="댓글을 삭제하시겠습니까?"
            onCancel={() => setDeleteTargetCommentId(null)}
            onConfirm={() => {
              onDeleteComment(deleteTargetCommentId);
              setDeleteTargetCommentId(null);
            }}
            confirmText="삭제"
            cancelText="취소"
            type={MODAL_TYPES.CONFIRM_CANCEL}
          />
        </section>

        {/* 게시글 삭제 모달 */}
        <ConfirmModal
          open={showDeletePostModal}
          title="게시글 삭제"
          message="정말로 삭제하시겠습니까?<br/>삭제 후 되돌릴 수 없습니다."
          onCancel={() => setShowDeletePostModal(false)}
          onConfirm={() => {
            setShowDeletePostModal(false);
            onDelete();
          }}
          confirmText="삭제"
          cancelText="취소"
          type={MODAL_TYPES.CONFIRM_CANCEL}
        />

        {/* 댓글 입력칸 */}
        <div
          id="commentInput"
          className="mt-8 rounded-2xl border bg-white p-4 shadow-sm"
        >
          <div className="mb-3 text-sm font-medium text-gray-700">
            의견을 남겨보세요
          </div>
          <div className="flex items-end gap-2">
            <textarea
              className={`min-h-[44px] w-full resize-none rounded-xl border px-4 py-3 text-[15px] outline-none 
                ${
                  commentInput.length > 1000
                    ? "border-red-500"
                    : "focus:ring-2 focus:ring-gray-200"
                }`}
              placeholder="댓글을 작성하여 게시글에 참여해보세요 !"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              maxLength={1001}
            />
            <div className="flex flex-col items-center gap-1">
              <span
                className={
                  commentInput.length > 1000
                    ? "text-[12px] text-red-500"
                    : "text-[12px] text-gray-400"
                }
              >
                {commentInput.length} / 1000
              </span>
              <button
                onClick={onAddComment}
                disabled={
                  commentInput.trim().length === 0 || commentInput.length > 1000
                }
                className={`h-10 shrink-0 rounded-xl px-4 text-sm font-medium whitespace-nowrap
                  ${
                    commentInput.trim().length === 0 ||
                    commentInput.length > 1000
                      ? "bg-gray-300 cursor-not-allowed text-white"
                      : "bg-[#85B3EB] cursor-pointer hover:brightness-95 text-white"
                  }`}
              >
                등록
              </button>
            </div>
          </div>
        </div>

        {/* 공동구매: 참여자 명단 모달 */}
        {showListModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-[460px] h-[520px] max-w-[90vw] rounded-3xl bg-white p-6 shadow-xl flex flex-col">
              <div className="mb-2 flex items-start justify-between">
                <div className="w-full text-center">
                  <div className="text-[18px] font-semibold leading-tight">
                    공동 구매
                  </div>
                  <div className="text-[18px] font-semibold leading-tight">
                    참여자 명단
                  </div>
                </div>
                <button
                  onClick={() => setShowListModal(false)}
                  className="ml-2 text-xl leading-none text-gray-500 hover:text-gray-700"
                  aria-label="close"
                >
                  ×
                </button>
              </div>
              <ul className="mt-4 mb-6 space-y-3 overflow-y-auto">
                {normalizedParticipants.map((p, idx) => {
                  const when = p.joinedAt
                    ? formatDateTime(parseDateAny(p.joinedAt) || new Date())
                    : "";
                  const isCrowned = idx === 0;
                  return (
                    <li
                      key={`${p.name}-${idx}`}
                      className="flex items-center justify-between px-1"
                    >
                      <div className="flex items-center gap-2">
                        {isCrowned && <span className="text-sm">👑</span>}
                        <span className="text-[15px]">{p.name}</span>
                      </div>
                      <div className="text-[13px] text-gray-500 tabular-nums">
                        {when}
                      </div>
                    </li>
                  );
                })}
              </ul>
              {!isOwner && joinedHere && (
                <div className="mt-auto flex justify-center">
                  <button
                    onClick={onCancelJoin}
                    className="h-12 w-36 rounded-xl text-white hover:brightness-95"
                    style={{ backgroundColor: "#85B3EB" }}
                  >
                    참여 취소
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ─────────────────────────────
   Child: AuctionHeader
   ────────────────────────────*/
function AuctionHeader({
  endTime,
  status,
  currentPrice,
  minNext, // 현재가 + 1원
  onBid,
  bidInput,
  setBidInput,
  bids = [],
}) {
  const { label, ms } = useCountdown(endTime);
  const closed = String(status).includes("완료") || ms === 0;

  return (
    <div className="mb-8 text-center">
      <div className="my-6">
        <div className="text-red-500 text-[14px]">
          마감까지 남은 시간 : <b>{label}</b>
        </div>
        <div className="mt-1 text-[14px]">
          낙찰가(현재가) : <b>{(currentPrice || 0).toLocaleString()} 원</b>
        </div>
        {closed && <div className="mt-1 text-sm text-gray-500">경매 완료</div>}
      </div>

      {!closed ? (
        <div className="mt-4 flex flex-col items-center gap-3">
          <div className="text-sm text-gray-500">
            최소 입찰가: {minNext.toLocaleString()} 원 (현재가 + 1원)
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              inputMode="numeric"
              step="1"
              min={minNext}
              value={bidInput}
              onChange={(e) => setBidInput(e.target.value)}
              placeholder="입찰가 입력"
              className="w-48 rounded-lg border px-3 py-2 text-sm"
            />
            <button
              onClick={onBid}
              className="rounded-lg px-5 py-2 text-white hover:brightness-95"
              style={{ backgroundColor: "#85B3EB" }}
            >
              참여 하기
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 text-sm text-gray-500">마감된 경매입니다.</div>
      )}

      {/* 입찰 이력 */}
      <div className="mt-8 text-left">
        <div className="mb-2 text-sm font-medium text-gray-700">입찰 이력</div>
        <ul className="space-y-2">
          {bids.length === 0 ? (
            <li className="text-sm text-gray-500">아직 입찰이 없습니다.</li>
          ) : (
            bids.map((b, i) => (
              <li
                key={i}
                className="flex justify-between rounded-xl border p-2 text-sm"
              >
                <span className="text-gray-600">
                  {b.bidderId || b.user || "익명"}
                </span>
                <span className="font-semibold">
                  {Number(b.price).toLocaleString()} 원
                </span>
                <span className="text-gray-500">
                  {formatDateTime(parseDateAny(b.time) || new Date(b.time))}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
