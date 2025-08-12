"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loadPosts, removePost } from "../lib/postStorage";

/* -----------------------------
   Storage 보조 헬퍼
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
   날짜 유틸
----------------------------- */
// 문자열/숫자/Date 다 받아서 Date로
function parseDateAny(v) {
  if (!v) return null;
  const d1 = new Date(v);
  if (!Number.isNaN(d1.getTime())) return d1;
  if (typeof v === "string" && v.includes(".")) {
    // "2025.07.31" 형식 대응
    const clean = v.replace(/\s/g, "");
    const m = clean.match(/^(\d{4})\.(\d{2})\.(\d{2})/);
    if (m) {
      const y = Number(m[1]);
      const mo = Number(m[2]) - 1;
      const da = Number(m[3]);
      const d2 = new Date(y, mo, da);
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
   간단 sanitizer
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

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = useMemo(() => (params?.id ? String(params.id) : null), [params]);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");

  // 최초 진입 1회 조회수 증가
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
  }, [id, bumpViewOnce]);

  const backTab =
    searchParams.get("tab") ||
    (post?.category === "공동구매" ? "groupbuy" : "tips") ||
    "tips";

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
    } catch {}
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
      createdAt: new Date().toISOString(), // 저장 시점의 실제 작성시간
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

  // 게시글 작성 시각: 저장된 값만 사용 (현재시간 폴백 없음)
  const createdAt =
    parseDateAny(post?.createdAt) ||
    parseDateAny(post?.date) ||
    null;
  const writtenDateTime = createdAt ? formatDateTime(createdAt) : "";

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
          <button onClick={onEdit} className="text-gray-400 hover:text-gray-600" type="button">
            수정
          </button>
          <span className="text-gray-300">|</span>
          <button onClick={onDelete} className="text-gray-400 hover:text-red-500" type="button">
            삭제
          </button>
          <span className="text-gray-300">|</span>
          <a href="#comments" className="inline-flex items-center gap-1 hover:underline text-gray-700">
            <span className="inline-block w-5 h-5 text-[16px] leading-5">💬</span>
            <span className="text-[14px]">댓글 {comments.length}</span>
          </a>
          <span className="text-gray-300">|</span>
          <button onClick={onCopyUrl} className="inline-flex items-center gap-1 hover:underline text-gray-700">
            <span className="inline-block w-5 h-5 text-[16px] leading-5">🔗</span>
            <span className="text-[14px]">url 복사</span>
          </button>
        </div>
      </div>

      {/* 제목/메타 */}
      <div className="pb-4 border-b">
        <h1 className="mb-1 text-[22px] font-semibold tracking-tight">
          {post?.title || "(제목 없음)"}
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

      {/* 좋아요/댓글 */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-6 text-sm text-gray-700">
          <button onClick={onToggleLike} className="group inline-flex items-center gap-1">
            <span>❤️</span>
            <span>좋아요 {likes}</span>
          </button>
          <a href="#comments" className="inline-flex items-center gap-1">
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

      {/* 댓글 */}
      <section id="comments" className="mt-6">
        {comments.length > 0 ? (
          <ul className="space-y-6">
            {comments.map((c) => {
              // 저장된 createdAt만 사용 (현재시간 폴백 제거)
              const d = parseDateAny(c.createdAt);
              const when = d ? formatDateTime(d) : ""; // 없으면 빈값 표시
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
            className="h-10 shrink-0 rounded-xl bg-black px-4 text-sm font-medium text-white hover:opacity-90"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}
