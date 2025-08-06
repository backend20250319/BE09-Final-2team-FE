"use client";

import ChatListSidebar from "@/app/chat/components/ChatListSideBar";
import { groupCategoryWithColumn } from "@/utils/groupCategoryData";
import { Heart, Menu, MessageCircleMore, Search, ShoppingBag, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { mockCategoryData } from "./data/HeaderCategoryData";
import WishlistSidebar from "./WishlistSidebar";

export default function Header() {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 추후 실제 로그인 상태로 교체
  const [categoryColumns, setCategoryColumns] = useState({});
  const router = useRouter();

  const handleLogout = () => {
    // 실제 로그아웃 로직 추가 필요
    setIsLoggedIn(false);
  };

  useEffect(() => {
    // mount 시 mock 데이터를 컬럼별 구조로 가공
    const grouped = groupCategoryWithColumn(mockCategoryData);
    setCategoryColumns(grouped);
  }, []);

  return (
    <header className="w-full border-b border-[#ddd] fixed bg-white z-50">
      <div className="flex flex-col mx-auto pt-4">
        {/* 첫 번째 줄: 로고, 검색창, 우측 메뉴 */}
        <div className="flex mx-auto gap-10">
          <div className="left">
            <Link href={"/"}>
              <div className="flex items-center gap-2">
                <Image src="/images/header/header-logo.png" width={128} height={128} alt="header-logo.png" />
              </div>
            </Link>
          </div>
          <div className="center flex flex-col justify-center items-center">
            <div className="bg-[#F1F4F6] relative rounded-[6px] w-[612px] h-[44px] pl-4 pr-11 py-[10px] mb-4">
              <input
                type="text"
                className="w-full outline-none bg-transparent"
                placeholder="어떤 육아 용품을 찾고 계신가요?"
              />
              <div className="absolute top-[10px] right-[16px] cursor-pointer">
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
                              {/* 1열, 2열, 3열 순회 */}
                              {[1, 2, 3].map((colNum) => (
                                <div key={colNum} className={`space-y-6 py-6 ${colNum % 2 === 1 ? "bg-gray-200" : ""}`}>
                                  {/* 해당 열에 포함된 그룹들을 렌더링 */}
                                  {(categoryColumns[colNum] || []).map((group, idx) => (
                                    <div key={idx}>
                                      <Link href="#">
                                        <h3 className="block text-body text-sm py-1.5 text-heading font-semibold px-5 xl:px-8 2xl:px-10 hover:text-heading hover:bg-gray-300">
                                          {group.title}
                                        </h3>
                                      </Link>
                                      {group.items && group.items.length > 0 && (
                                        <ul>
                                          {group.items.map((item, i) => (
                                            <li key={i}>
                                              <Link
                                                href={item.href}
                                                className="text-[#5a5a5a] text-sm block py-1.5 px-5 xl:px-8 2xl:px-10 hover:text-black hover:bg-gray-300"
                                              >
                                                {item.name}
                                              </Link>
                                            </li>
                                          ))}
                                        </ul>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
                <li className="flex justify-center items-center">
                  <WishlistSidebar
                    trigger={
                      <Button className="w-[110px] h-[44px]">
                        <Heart color="#ffffff" fill="#ffffff" />
                        찜한상품
                      </Button>
                    }
                  />
                </li>
                <li className="flex justify-center items-center">
                  <Link href={"#"}>
                    <Button className="w-[110px] h-[44px]">
                      <Image src={"/images/header/tabler_bulb.png"} width={24} height={24} alt="육아꿀팁" />
                      육아꿀팁
                    </Button>
                  </Link>
                </li>
                <li className="flex justify-center items-center">
                  <Link href={"#"}>
                    <Button className="w-[110px] h-[44px]">
                      <Image src={"/images/header/shopping-bag.png"} width={18} height={18} alt="공동구매" />
                      공동구매
                    </Button>
                  </Link>
                </li>
                <li className="flex justify-center items-center">
                  <Link href={"#"}>
                    <Button className="bg-[#85B3EB] hover:bg-[#65A2EE] w-[110px] h-[44px]">
                      <Image src={"/images/header/fluent-mdl2_special-event.png"} width={18} height={18} alt="이벤트" />
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
                  <ChatListSidebar
                    trigger={
                      <button className="flex items-center gap-1 cursor-pointer">
                        <MessageCircleMore color="#000000" />
                        <span className="text-sm">채팅하기</span>
                      </button>
                    }
                  ></ChatListSidebar>
                </li>
                <li className="px-3">|</li>
                <li>
                  <Link href={"#"} className="flex items-center gap-1">
                    <ShoppingBag color="#000000" />
                    <span className="text-sm">판매하기</span>
                  </Link>
                </li>
                <li className="px-3">|</li>
                {isLoggedIn ? (
                  <li className="relative">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-1 cursor-pointer">
                          <User color="#000000" />
                          <span className="text-sm">마이</span>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center" className="w-25">
                        <DropdownMenuItem asChild className="text-xs w-full justify-center">
                          <Link href="/mypage">마이페이지</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout} className="text-xs w-full justify-center">
                          로그아웃
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                ) : (
                  <li>
                    <button onClick={() => router.push("/")} className="flex items-center gap-1 cursor-pointer">
                      <User color="#000000" />
                      <span className="text-sm">마이</span>
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
