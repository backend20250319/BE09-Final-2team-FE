"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

// 육아꿀팁 더미 데이터 20개
const tipPosts = Array.from({ length: 20 }, (_, i) => ({
  id: 20 - i,
  title: `육아 꿀팁 게시글 ${20 - i}`,
  writer: i % 2 === 0 ? "홍길동" : "이순신",
  date: "2025.07.31",
  views: Math.floor(Math.random() * 300 + 1),
  comments: i % 3 === 0 ? Math.floor(Math.random() * 5) + 1 : 0,
}));

// 공동구매 더미 데이터 20개
const groupPosts = Array.from({ length: 20 }, (_, i) => ({
  id: 20 - i,
  status: i % 3 === 0 ? "모집중" : "모집완료",
  title: `공동구매 게시글 ${20 - i}`,
  region: ["서초동", "삼성동", "역삼동", "성수동", "장안동"][i % 5],
  writer: i % 2 === 0 ? "홍길동" : "이순신",
  date: "2025.07.31",
  views: Math.floor(Math.random() * 300 + 1),
  comments: i % 4 === 0 ? Math.floor(Math.random() * 5) + 1 : 0,
}));

export default function PostBoardPage() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") === "groupbuy" ? "groupbuy" : "tips";

  const [selectedTab, setSelectedTab] = useState(defaultTab);
  const [sort, setSort] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [excludeCompleted, setExcludeCompleted] = useState(false);
  const postsPerPage = 10;

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "groupbuy") setSelectedTab("groupbuy");
    else setSelectedTab("tips");
    setCurrentPage(1);
  }, [searchParams]);

  const getSortedPosts = (posts) => {
    let filtered = [...posts];
    if (selectedTab === "groupbuy" && excludeCompleted) {
      filtered = filtered.filter((post) => post.status === "모집중");
    }
    return filtered.sort((a, b) => {
      if (sort === "views") return b.views - a.views;
      return b.id - a.id;
    });
  };

  const posts = selectedTab === "tips" ? getSortedPosts(tipPosts) : getSortedPosts(groupPosts);
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const currentPosts = posts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 탭 */}
      <div className="flex justify-center space-x-10 mb-6 text-lg font-medium">
        <button
          className={selectedTab === "tips" ? "text-blue-500 border-b-2 border-blue-500 pb-1" : "text-gray-400 hover:text-gray-600"}
          onClick={() => handleTabChange("tips")}
        >
          육아 꿀팁
        </button>
        <button
          className={selectedTab === "groupbuy" ? "text-blue-500 border-b-2 border-blue-500 pb-1" : "text-gray-400 hover:text-gray-600"}
          onClick={() => handleTabChange("groupbuy")}
        >
          공동구매
        </button>
      </div>

      {/* 검색 + 정렬 + 모집완료제외 */}
      <div className="flex items-center justify-between mb-2">
        <div className="relative w-72">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            className="w-full border rounded-full px-4 py-2 pr-10 text-sm focus:outline-none"
          />
          <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
        </div>

        <div className="flex space-x-4 text-sm">
          {selectedTab === "groupbuy" && (
            <button
              onClick={() => setExcludeCompleted((prev) => !prev)}
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

      {/* 게시판 목록 */}
      {selectedTab === "tips" ? (
        <TipsTable posts={currentPosts} />
      ) : (
        <GroupBuyTable posts={currentPosts} />
      )}

      {/* 페이지네이션 */}
      <div className="flex justify-center items-center space-x-2 text-sm mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="text-gray-500 hover:text-blue-500"
        >
          &lt; Back
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-2 py-1 rounded ${currentPage === i + 1 ? "bg-blue-100" : "hover:bg-blue-50"}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="text-gray-500 hover:text-blue-500"
        >
          Next &gt;
        </button>
      </div>

      {/* 글쓰기 */}
      <div className="flex justify-end mt-6">
        <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">글쓰기</button>
      </div>
    </div>
  );
}

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
        {posts.map((post, idx) => (
          <tr key={post.id} className="border-b hover:bg-gray-50">
            <td className="py-2">{idx + 1}</td>
            <td className="py-2 text-left pl-2">
              {post.title}
              {post.comments > 0 && <span className="text-blue-500 ml-1">💬{post.comments}</span>}
            </td>
            <td className="py-2">{post.writer}</td>
            <td className="py-2">{post.date}</td>
            <td className="py-2">{post.views}</td>
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
        {posts.map((post, idx) => (
          <tr key={post.id} className="border-b hover:bg-gray-50">
            <td className="py-2">{idx + 1}</td>
            <td className="py-2">{post.status}</td>
            <td className="py-2 text-left pl-2">
              {post.title}
              {post.comments > 0 && <span className="text-blue-500 ml-1">💬{post.comments}</span>}
            </td>
            <td className="py-2">{post.region}</td>
            <td className="py-2">{post.writer}</td>
            <td className="py-2">{post.date}</td>
            <td className="py-2">{post.views}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
