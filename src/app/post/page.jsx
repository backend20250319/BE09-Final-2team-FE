"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { loadPosts } from "./lib/postStorage";

/* ---------- 아이콘 & 유틸 ---------- */
// 본문 HTML에 이미지가 있는지 검사
const hasImage = (html = "") => {
  if (typeof html !== "string" || !html) return false;
  return /<img[^>]+src=["']([^"']+)["']/i.test(html);
};

// 심플한 사진 아이콘 (라인 스타일, 포인트 색 #65A2EE)
const PhotoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 flex-none"
    fill="none"
    viewBox="0 0 24 24"
    stroke="#65A2EE"
    strokeWidth={2}
  >
    <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
    <circle cx="8.5" cy="10.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);

/* ---------- 결정적 더미 데이터 (SSR/CSR 일치) ---------- */
const viewsByIndex = (i) => ((i * 73) % 300) + 1;
const commentsByIndexTips = (i) => (i % 3 === 0 ? ((i * 7) % 5) + 1 : 0);
const commentsByIndexGroup = (i) => (i % 4 === 0 ? ((i * 5) % 5) + 1 : 0);

const dummyTips = Array.from({ length: 20 }, (_, i) => ({
  id: 20 - i,
  title: `육아 꿀팁 게시글 ${20 - i}`,
  writer: i % 2 === 0 ? "홍길동" : "이순신",
  date: "2025.07.31",
  views: viewsByIndex(i),
  comments: commentsByIndexTips(i),
  content: "", // 검색/마크 안정성용
}));

const dummyGroup = Array.from({ length: 20 }, (_, i) => ({
  id: 20 - i,
  status: i % 3 === 0 ? "모집중" : "모집완료",
  title: `공동구매 게시글 ${20 - i}`,
  region: ["서초동", "삼성동", "역삼동", "성수동", "장안동"][i % 5],
  writer: i % 2 === 0 ? "홍길동" : "이순신",
  date: "2025.07.31",
  views: viewsByIndex(i),
  comments: commentsByIndexGroup(i),
  content: "",
}));

export default function PostBoardPage() {
  const sp = useSearchParams();
  const defaultTab = sp.get("tab") === "groupbuy" ? "groupbuy" : "tips";

  const [selectedTab, setSelectedTab] = useState(defaultTab);
  const [sort, setSort] = useState("latest"); // "latest" | "views"
  const [currentPage, setCurrentPage] = useState(1);
  const [excludeCompleted, setExcludeCompleted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 로컬 저장 글
  const [userTips, setUserTips] = useState([]);
  const [userGroup, setUserGroup] = useState([]);

  // URL 쿼리(tab) 반영
  useEffect(() => {
    setSelectedTab(sp.get("tab") === "groupbuy" ? "groupbuy" : "tips");
    setCurrentPage(1);
  }, [sp]);

  // 최초 로드 시 localStorage 글 불러오기
  useEffect(() => {
    setUserTips(loadPosts("tips"));
    setUserGroup(loadPosts("groupbuy"));
  }, []);

  const postsPerPage = 10;

  // 로컬글을 더미 위에 쌓기
  const mergedTips = useMemo(() => [...userTips, ...dummyTips], [userTips]);
  const mergedGroup = useMemo(() => [...userGroup, ...dummyGroup], [userGroup]);

  // 🔎 검색 (제목/내용, 대소문자 무시)
  const normalize = (v) => (typeof v === "string" ? v.toLowerCase() : "");
  const query = normalize(searchQuery);

  const filteredTips = useMemo(() => {
    if (!query) return mergedTips;
    return mergedTips.filter(
      (p) => normalize(p.title).includes(query) || normalize(p.content).includes(query)
    );
  }, [mergedTips, query]);

  const filteredGroup = useMemo(() => {
    if (!query) return mergedGroup;
    return mergedGroup.filter(
      (p) => normalize(p.title).includes(query) || normalize(p.content).includes(query)
    );
  }, [mergedGroup, query]);

  const getSortedPosts = (posts) => {
    let filtered = posts;
    if (selectedTab === "groupbuy" && excludeCompleted) {
      filtered = filtered.filter((p) => (p.status || "모집중") === "모집중");
    }
    return [...filtered].sort((a, b) =>
      sort === "views" ? (b.views ?? 0) - (a.views ?? 0) : (b.id ?? 0) - (a.id ?? 0)
    );
  };

  // 탭별로 검색 → 정렬 → 페이지네이션
  const prepared =
    selectedTab === "tips" ? getSortedPosts(filteredTips) : getSortedPosts(filteredGroup);

  const totalPages = Math.ceil(prepared.length / postsPerPage) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const currentPosts = prepared.slice(
    (safePage - 1) * postsPerPage,
    safePage * postsPerPage
  );

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setCurrentPage(1);
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
          onClick={() => handleTabChange("tips")}
        >
          육아 꿀팁
        </button>
        <button
          className={
            selectedTab === "groupbuy"
              ? "text-blue-500 border-b-2 border-blue-500 pb-1"
              : "text-gray-400 hover:text-gray-600"
          }
          onClick={() => handleTabChange("groupbuy")}
        >
          공동구매
        </button>
      </div>

      {/* 검색 / 정렬 / 모집완료 제외 */}
      <div className="flex items-center justify-between mb-2">
        {/* 돋보기 세로 중앙 정렬 */}
        <div className="relative">
          <input
            type="text"
            placeholder="제목/내용 검색"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-72 border rounded-full px-4 py-2 pr-10 text-sm focus:outline-none"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex space-x-4 text-sm">
            {selectedTab === "groupbuy" && (
              <button
                onClick={() => setExcludeCompleted((v) => !v)}
                className={`px-3 py-1 rounded ${
                  excludeCompleted ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-600"
                } hover:bg-blue-200`}
              >
                {excludeCompleted ? "모집완료 포함" : "모집완료 제외"}
              </button>
            )}
            <button
              onClick={() => setSort("latest")}
              className={sort === "latest" ? "text-blue-500 font-semibold" : "text-gray-500"}
            >
              최신순
            </button>
            <button
              onClick={() => setSort("views")}
              className={sort === "views" ? "text-blue-500 font-semibold" : "text-gray-500"}
            >
              조회수순
            </button>
          </div>
        </div>
      </div>

      {/* 테이블 */}
      {currentPosts.length === 0 ? (
        <div className="py-16 text-center text-sm text-gray-500">검색 결과가 없습니다.</div>
      ) : selectedTab === "tips" ? (
        <TipsTable posts={currentPosts} />
      ) : (
        <GroupBuyTable posts={currentPosts} />
      )}

      {/* 페이지네이션 */}
      <div className="flex justify-center items-center space-x-2 text-sm mt-4">
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

      {/* 글쓰기 버튼 */}
      <div className="flex justify-end mt-6">
        <Link href={`/post/write?tab=${selectedTab}`}>
          <button
            className="px-6 py-2 text-white rounded hover:brightness-95"
            style={{ backgroundColor: "#65A2EE" }}
          >
            글쓰기
          </button>
        </Link>
      </div>
    </div>
  );
}

/* ---------- 테이블 컴포넌트 ---------- */
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
          <tr key={p.id} className="border-b hover:bg-gray-50">
            <td className="py-2">{idx + 1}</td>
            <td className="py-2 text-left pl-2">
              <div className="flex items-center gap-2 min-w-0">
                {hasImage(p.content) && <PhotoIcon />}
                <span className="truncate">{p.title}</span>
                {p.comments > 0 && (
                  <span className="text-blue-500 ml-1 flex-none">💬{p.comments}</span>
                )}
              </div>
            </td>
            <td className="py-2">{p.writer}</td>
            <td className="py-2">{p.date}</td>
            <td className="py-2">{p.views ?? 0}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function GroupBuyTable({ posts }) {
  return (
    <table className="w-full text-sm text-center border-t border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="py-2 w-12">No</th>
          <th className="py-2 w-20">모집상태</th>
          <th className="py-2 text-left">제목</th>
          <th className="py-2 w-20">지역</th>
          <th className="py-2 w-24">작성자</th>
          <th className="py-2 w-28">작성일자</th>
          <th className="py-2 w-20">조회수</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((p, idx) => (
          <tr key={p.id} className="border-b hover:bg-gray-50">
            <td className="py-2">{idx + 1}</td>
            <td className="py-2">{p.status || "모집중"}</td>
            <td className="py-2 text-left pl-2">
              <div className="flex items-center gap-2 min-w-0">
                {hasImage(p.content) && <PhotoIcon />}
                <span className="truncate">{p.title}</span>
                {p.comments > 0 && (
                  <span className="text-blue-500 ml-1 flex-none">💬{p.comments}</span>
                )}
              </div>
            </td>
            <td className="py-2">{p.region || ""}</td>
            <td className="py-2">{p.writer}</td>
            <td className="py-2">{p.date}</td>
            <td className="py-2">{p.views ?? 0}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
