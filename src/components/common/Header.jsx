"use client";

// 🔥 개별 상태 훅들 import
import { useUser, useIsAuthenticated, useUserLoading, useLogout } from "@/store/userStore";
import { useCategoryStore } from "@/store/categoryStore";
import ChatListSidebar from "@/app/chat/components/ChatListSideBar";
import { groupCategoryWithColumn } from "@/utils/groupCategoryData";
import { Heart, Menu, MessageCircleMore, Search, ShoppingBag, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import WishlistSidebar from "./WishlistSidebar";

export default function Header() {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categoryColumns, setCategoryColumns] = useState({});

  // zustand에서 카테고리 가져오기
  const categories = useCategoryStore((s) => s.categories);

  // 개별 훅 사용 (무한 루프 방지)
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const loading = useUserLoading();
  const logout = useLogout();

  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const handleSearch = () => {
    if (keyword.trim() && !isComposing) {
      router.push(`/product/search?keyword=${encodeURIComponent(keyword.trim())}`);
    }
    setKeyword("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isComposing) {
      handleSearch();
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  // 백엔드 연동 로그아웃 핸들러
  const handleLogout = async () => {
    if (loading) return; // 로딩 중이면 중복 실행 방지

    try {
      const result = await logout();
      if (result.success) {
        alert("로그아웃되었습니다.");
        router.push("/"); // 메인으로 이동
      } else {
        alert("로그아웃 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("로그아웃 에러:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  // 로그인 페이지로 이동
  const handleLoginClick = () => {
    router.push("/login");
  };

  // 판매 페이지 인증처리
  const handleSellClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault(); // 원래 링크 이동 막기
      handleLoginClick();
    }
  };

  // 카테고리 데이터 가공 (3열로 분리)
  useEffect(() => {
    if (categories.length > 0) {
      const grouped = groupCategoryWithColumn(categories);
      setCategoryColumns(grouped);
    }
  }, [categories]);

  return (
    <header className="w-full border-b border-[#ddd] fixed bg-white z-50">
      <div className="flex flex-col mx-auto pt-4">
        {/* 첫 번째 줄: 로고, 검색창, 우측 메뉴 */}
        <div className="flex mx-auto gap-10">
          <div className="left">
            <Link href={"/"}>
              <div className="flex items-center gap-2">
                <Image src="/images/common/main-logo.png" width={128} height={128} alt="header-logo.png" />
              </div>
            </Link>
          </div>
          <div className="center flex flex-col justify-center items-center">
            <div className="bg-[#F1F4F6] relative rounded-[6px] w-[612px] h-[44px] pl-4 pr-11 py-[10px] mb-4">
              <input
                type="text"
                value={keyword || ""}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                className="w-full outline-none bg-transparent"
                placeholder="어떤 육아 용품을 찾고 계신가요?"
              />
              <div className="absolute top-[10px] right-[16px] cursor-pointer" onClick={handleSearch}>
                <Search />
              </div>
            </div>
            {/* 카테고리 버튼들 */}
            <div className="flex justify-center items-center mx-auto gap-4">
              <ul className="flex gap-4 w-full">
                <li className="flex justify-center items-center relative">
                  <div
                    className="relative"
                    onMouseEnter={() => setIsCategoryOpen(true)}
                    onMouseLeave={() => setIsCategoryOpen(false)}
                  >
                    <Button className="bg-[#85B3EB] hover:bg-[#65A2EE] w-[110px] h-[44px]">
                      <Menu color="#ffffff" />
                      카테고리
                    </Button>

                    {/* 카테고리 드롭다운 메뉴 */}
                    {isCategoryOpen && (
                      <div className="absolute top-[55px] left-0 bg-white border border-[#ddd] shadow-lg z-50 rounded-md min-w-[720px] max-h-[500px]">
                        {/* 호버 브리지 - 버튼과 메뉴 사이 공백을 채워줌 */}
                        <div className="absolute -top-[11px] left-0 w-full h-[10px] bg-transparent"></div>
                        <div className="overflow-y-auto max-h-[500px]">
                          <div className="">
                            {/* 3열 그리드 구성 */}
                            <div className="grid grid-cols-3">
                              {[0, 1, 2].map((colIndex) => {
                                const col = categoryColumns[colIndex] || [];
                                return (
                                  <div
                                    key={colIndex}
                                    className={`space-y-6 py-6 ${colIndex % 2 === 0 ? "bg-[#F4F4F4]" : ""}`}
                                  >
                                    {col.map((category) => (
                                      <div key={category.id}>
                                        <Link href={`/product/search?category=${category.id}`}>
                                          <h3 className="block text-body text-sm py-1.5 text-heading font-semibold px-5 xl:px-8 2xl:px-10 hover:text-heading hover:bg-gray-300">
                                            {category.name}
                                          </h3>
                                        </Link>
                                        {category.children?.length > 0 && (
                                          <ul>
                                            {category.children.map((child) => (
                                              <li key={child.id}>
                                                <Link
                                                  href={`/product/search?category=${child.id}`}
                                                  className="text-[#5a5a5a] text-sm block py-1.5 px-5 xl:px-8 2xl:px-10 hover:text-black hover:bg-gray-300"
                                                >
                                                  {child.name}
                                                </Link>
                                              </li>
                                            ))}
                                          </ul>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
                <li className="flex justify-center items-center">
                  {isAuthenticated ? (
                    <WishlistSidebar
                      trigger={
                        <Button className="w-[110px] h-[44px]">
                          <Heart color="#ffffff" fill="#ffffff" />
                          찜한상품
                        </Button>
                      }
                    />
                  ) : (
                    <Button
                      className="w-[110px] h-[44px]"
                      onClick={handleLoginClick} // 로그인으로 이동만
                    >
                      <Heart color="#ffffff" fill="#ffffff" />
                      찜한상품
                    </Button>
                  )}
                </li>

                <li className="flex justify-center items-center">
                  <Link href={`${isAuthenticated ? "/post?tab=tips" : "/login"}`}>
                    <Button className="w-[110px] h-[44px]">
                      <Image src={"/images/common/tabler_bulb.png"} width={24} height={24} alt="육아꿀팁" />
                      육아꿀팁
                    </Button>
                  </Link>
                </li>
                <li className="flex justify-center items-center">
                  <Link href={`${isAuthenticated ? "/post?tab=groupbuy" : "/login"}`}>
                    <Button className="w-[110px] h-[44px]">
                      <Image src={"/images/common/shopping-bag.png"} width={18} height={18} alt="공동구매" />
                      상품경매
                    </Button>
                  </Link>
                </li>
                <li className="flex justify-center items-center">
                  <Link href={"#"}>
                    <Button className="bg-[#85B3EB] hover:bg-[#65A2EE] w-[110px] h-[44px]">
                      <Image src={"/images/common/fluent-mdl2_special-event.png"} width={18} height={18} alt="이벤트" />
                      이벤트
                    </Button>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="right">
            <div className="pt-5">
              <ul className="flex w-full">
                <li>
                  {isAuthenticated ? (
                    <ChatListSidebar
                      trigger={
                        <button className="flex items-center gap-1 cursor-pointer">
                          <MessageCircleMore color="#000000" />
                          <span className="text-sm">채팅하기</span>
                        </button>
                      }
                    />
                  ) : (
                    <button
                      onClick={handleLoginClick}
                      className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors"
                    >
                      <MessageCircleMore color="#000000" />
                      <span className="text-sm">채팅하기</span>
                    </button>
                  )}
                </li>
                <li className="px-3">|</li>
                <li>
                  <Link href="/product/form?type=regist" onClick={handleSellClick} className="flex items-center gap-1">
                    <ShoppingBag color="#000000" />
                    <span className="text-sm">판매하기</span>
                  </Link>
                </li>
                <li className="px-3">|</li>

                {/* 인증 상태에 따른 조건부 렌더링 (백엔드 연동) */}
                {isAuthenticated ? (
                  <li className="relative">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors"
                          disabled={loading}
                        >
                          <User color="#000000" />
                          <span className="text-sm">{loading ? "로딩..." : "마이"}</span>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center" className="w-32">
                        <DropdownMenuItem asChild className="text-xs w-full justify-center cursor-pointer">
                          <Link href="/mypage">마이페이지</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={handleLogout}
                          className="text-xs w-full justify-center cursor-pointer text-red-600 hover:text-red-700"
                          disabled={loading}
                        >
                          {loading ? "로그아웃 중..." : "로그아웃"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                ) : (
                  <li>
                    <button
                      onClick={handleLoginClick}
                      className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors"
                      disabled={loading}
                    >
                      <User color="#000000" />
                      <span className="text-sm">{loading ? "확인중..." : "마이"}</span>
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
