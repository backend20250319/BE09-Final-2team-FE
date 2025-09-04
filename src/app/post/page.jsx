"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { postAPI } from "@/lib/api";

/* 고정 높이 */
const LIST_MIN_HEIGHT = 400;

/* 썸네일 추출 */
const firstImgSrc = (html = "") => {
  if (typeof html !== "string" || !html) return null;
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
};
const pickThumb = (p) =>
  p?.thumbnail || firstImgSrc(p?.contentHtml || p?.content || "");

/* 경매 상태/가격/남은 시간 (간단 버전 유지) */
const currentPriceOf = (p) =>
  Number(p?.currentPrice ?? p?.startingPrice ?? 0) || 0;
const isAuctionClosed = (p) => {
  const s = String(p?.status || "").toUpperCase();
  if (s.includes("완료") || s.includes("CLOSED")) return true;
  if (p?.endTime) return new Date(p.endTime).getTime() <= Date.now();
  return false;
};
const remainLabel = (end) => {
  if (!end) return "";
  const ms = new Date(end).getTime() - Date.now();
  if (ms <= 0) return "종료";
  const d = Math.floor(ms / (24 * 3600e3));
  const h = Math.floor((ms % (24 * 3600e3)) / 3600e3);
  const m = Math.floor((ms % 3600e3) / 60e3);
  if (d > 0)
    return `D-${d} ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} 남음`;
};

export default function PostBoardPage() {
  const sp = useSearchParams();
  const defaultTab = sp.get("tab") === "auction" ? "auction" : "tips";

  const [selectedTab, setSelectedTab] = useState(defaultTab);
  const [sort, setSort] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [excludeCompleted, setExcludeCompleted] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [tips, setTips] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);

  // 탭 변경 반영
  useEffect(() => {
    setSelectedTab(sp.get("tab") === "auction" ? "auction" : "tips");
    setCurrentPage(1);
  }, [sp]);

  // 서버에서 로드
  const reload = async () => {
    setLoading(true);
    try {
      // category는 백엔드에서 어떤 값을 기대하는지에 따라 전달 (예: "육아 꿀팁" or "tips")
      const [tipsPage, auctionPage] = await Promise.all([
        postAPI.getPosts({ category: "육아 꿀팁", page: 0, size: 200 }),
        postAPI.getPosts({ category: "경매", page: 0, size: 200 }),
      ]);
      const mapItem = (x) => ({
        ...x,
        id: x.id ?? x.postId ?? x.uuid,
        title: x.title,
        content: x.contentHtml ?? x.content,
        writer: tipsPage.data.data.content.nickName?? x.writer ,
        date: x.createdAt
          ? x.createdAt.slice(0, 10).replaceAll("-", ".")
          : x.date,
        views: x.views ?? x.viewCount ?? 0,
      });

      const tipsArr = Array.isArray(tipsPage.data.data?.content)
        ? tipsPage.data.data?.content.map(mapItem)
        : [];
      const auctionArr = Array.isArray(auctionPage.data?.content)
        ? auctionPage.data.data.content.map(mapItem)
        : [];

      setTips(tipsArr);
      setAuctions(auctionArr);
    } catch (e) {
      console.error("게시글 목록 로드 실패:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const normalize = (v) => (typeof v === "string" ? v.toLowerCase() : "");
  const query = normalize(searchQuery);

  const filteredTips = useMemo(() => {
    const arr = tips;
    if (!query) return arr;
    return arr.filter(
      (p) =>
        normalize(p.title).includes(query) ||
        normalize(p.content).includes(query)
    );
  }, [tips, query]);

  const filteredAuction = useMemo(() => {
    let arr = auctions;
    if (excludeCompleted) arr = arr.filter((p) => !isAuctionClosed(p));
    if (!query) return arr;
    return arr.filter(
      (p) =>
        normalize(p.title).includes(query) ||
        normalize(p.content).includes(query)
    );
  }, [auctions, query, excludeCompleted]);

  const getSorted = (posts) =>
    [...posts].sort((a, b) =>
      sort === "views"
        ? (b.views ?? 0) - (a.views ?? 0)
        : new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime() || (b.id ?? 0) - (a.id ?? 0)
    );

  const prepared =
    selectedTab === "tips"
      ? getSorted(filteredTips)
      : getSorted(filteredAuction);

  const postsPerPage = selectedTab === "tips" ? 10 : 12;
  const totalPages = Math.ceil(prepared.length / postsPerPage) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const currentPosts = prepared.slice(
    (safePage - 1) * postsPerPage,
    safePage * postsPerPage
  );

  const submitSearch = () => {
    setSearchQuery(searchInput.trim());
    setCurrentPage(1);
  };
  const onKeyDownSearch = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitSearch();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 탭 */}
      <div className="flex justify-center space-x-10 mb-6 text-lg font-medium">
        <button
          className={
            selectedTab === "tips"
              ? "text-blue-500 border-b-2 border-blue-500 pb-1"
              : "text-gray-400 hover:text-gray-600"
          }
          onClick={() => {
            setSelectedTab("tips");
            setCurrentPage(1);
          }}
        >
          육아 꿀팁
        </button>
        <button
          className={
            selectedTab === "auction"
              ? "text-blue-500 border-b-2 border-blue-500 pb-1"
              : "text-gray-400 hover:text-gray-600"
          }
          onClick={() => {
            setSelectedTab("auction");
            setCurrentPage(1);
          }}
        >
          경매
        </button>
      </div>

      {/* 검색/정렬/필터 */}
      <div className="flex items-center justify-between mb-2">
        <div className="relative">
          <input
            type="text"
            placeholder="제목/내용 검색"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={onKeyDownSearch}
            className="w-72 border rounded-full px-4 py-2 pr-10 text-sm focus:outline-none"
          />
          <button
            type="button"
            onClick={submitSearch}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-gray-500 hover:bg-gray-100 cursor-pointer"
            aria-label="검색"
            title="검색"
          >
            🔍
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex space-x-4 text-sm">
            {selectedTab === "auction" && (
              <button
                onClick={() => setExcludeCompleted((v) => !v)}
                className={`px-3 py-1 rounded ${
                  excludeCompleted
                    ? "bg-blue-500 text-white"
                    : "bg-blue-100 text-blue-600"
                } hover:bg-blue-200`}
              >
                {excludeCompleted ? "경매완료 포함" : "경매완료 제외"}
              </button>
            )}
            <button
              onClick={() => setSort("latest")}
              className={
                sort === "latest"
                  ? "text-blue-500 font-semibold"
                  : "text-gray-500"
              }
            >
              최신순
            </button>
            <button
              onClick={() => setSort("views")}
              className={
                sort === "views"
                  ? "text-blue-500 font-semibold"
                  : "text-gray-500"
              }
            >
              조회수순
            </button>
          </div>
        </div>
      </div>

      {/* 목록 */}
      <div className="relative" style={{ minHeight: LIST_MIN_HEIGHT }}>
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-500">
            불러오는 중…
          </div>
        ) : currentPosts.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500">
            검색 결과가 없습니다.
          </div>
        ) : selectedTab === "tips" ? (
          <TipsTable posts={currentPosts} />
        ) : (
          <AuctionCardGrid posts={currentPosts} />
        )}
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center items-center space-x-2 text-sm mt-2 pt-2 border-t border-gray-100">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          className="text-gray-500 hover:text-blue-500"
        >
          &lt; Back
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-2 py-1 rounded ${
              safePage === i + 1 ? "bg-blue-100" : "hover:bg-blue-50"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          className="text-gray-500 hover:text-blue-500"
        >
          Next &gt;
        </button>
      </div>

      {/* 글쓰기 */}
      <div className="flex justify-end mt-6">
        <Link href={`/post/write?tab=${selectedTab}`}>
          <button
            className="px-6 py-2 text-white rounded hover:brightness-95 cursor-pointer"
            style={{ backgroundColor: "#65A2EE" }}
          >
            글쓰기
          </button>
        </Link>
      </div>
    </div>
  );
}

/* 꿀팁 표 */
function TipsTable({ posts }) {
  return (
    <table className="w-full text-sm text-center border-t border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="py-2 w-12">No</th>
          <th className="py-2 text-left">제목</th>
          <th className="py-2 w-24">작성자</th>
          <th className="py-2 w-28">작성일자</th>
          <th className="py-2 w-20">조회수</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((p, idx) => (
          <tr
            key={p.id ?? `${p.title}-${idx}`}
            className="border-b hover:bg-gray-50"
          >
            <td className="py-2">{idx + 1}</td>
            <td className="py-2 text-left pl-2">
              <div className="flex items-center gap-2 min-w-0">
                <Link
                  href={`/post/${encodeURIComponent(p.id ?? p.title)}?tab=tips`}
                  className="truncate hover:underline"
                  title={p.title}
                >
                  {p.title}
                </Link>
                {Number(p.commentCount ?? 0) > 0 && (
                  <span className="text-blue-500 ml-1 flex-none">
                    💬{p.commentCount}
                  </span>
                )}
              </div>
            </td>
            <td className="py-2">{p.writer || p.author ||p.nickName}</td>
            <td className="py-2">{p.date}</td>
            <td className="py-2">{p.views ?? 0}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* 경매 카드 그리드 */
function AuctionCardGrid({ posts }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p) => {
        const thumb = pickThumb(p);
        const label = mounted
          ? isAuctionClosed(p)
            ? "경매완료"
            : "진행중"
          : String(p?.status || "").includes("완료")
          ? "경매완료"
          : "진행중";
        const closed = label === "경매완료";
        const statusClass = closed
          ? "bg-gray-200 text-gray-600"
          : "bg-red-100 text-red-600";
        const price = currentPriceOf(p);
        const remain = mounted ? remainLabel(p.endTime) : "";

        return (
          <Link
            key={p.id ?? p.title}
            href={`/post/${encodeURIComponent(p.id ?? p.title)}?tab=auction`}
            className="group block rounded-2xl border bg-white shadow-sm hover:shadow-md transition overflow-hidden"
          >
            <div className="relative aspect-video w-full bg-gray-100">
              {thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumb}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-4xl">
                  🧸
                </div>
              )}
              <span
                suppressHydrationWarning
                className={`absolute left-2 top-2 rounded-full px-2 py-1 text-xs ${statusClass}`}
              >
                {label}
              </span>
              {remain && (
                <span
                  suppressHydrationWarning
                  className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white"
                >
                  {remain}
                </span>
              )}
            </div>

            <div className="p-3">
              <div className="mb-1 line-clamp-2 text-[15px] font-semibold leading-snug">
                {p.title}
              </div>
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span>{p.writer || p.author || "익명"}</span>
                {p.date && (
                  <>
                    <span className="text-gray-300">·</span>
                    <span>{p.date}</span>
                  </>
                )}
                <span className="text-gray-300">·</span>
                <span>조회 {p.views ?? 0}</span>
                {Number(p.commentCount ?? 0) > 0 && (
                  <>
                    <span className="text-gray-300">·</span>
                    <span>💬{p.commentCount}</span>
                  </>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="font-medium">
                  현재가{" "}
                  <span className="text-gray-900">
                    {price.toLocaleString()}원
                  </span>
                </div>
                {typeof p.minIncrement !== "undefined" && (
                  <div className="text-xs text-gray-500">
                    +{Number(p.minIncrement).toLocaleString()}원
                  </div>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
