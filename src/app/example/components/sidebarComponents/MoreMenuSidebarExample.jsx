"use client";

import Sidebar from "@/components/common/Sidebar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Siren, Ban, Share2, Bookmark } from "lucide-react";

export default function MoreMenuSidebarExample() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">4. 더보기 메뉴 사이드바</h3>
      <p className="text-sm text-gray-600 mb-4">
        더보기 버튼(점 3개)이 있는 사이드바입니다. 추가 옵션을 제공할 때 사용합니다.
      </p>

      <Sidebar
        sidebarKey="withMenu"
        title="채팅방"
        trigger={
          <Button variant="outline" className="w-full">
            더보기 메뉴 사이드바 열기
          </Button>
        }
        add={true}
        onAdd={() => setShowMenu(!showMenu)}
      >
        <div className="space-y-4">
          {/* 더보기 메뉴 */}
          {showMenu && (
            <div className="flex justify-center items-center gap-6 px-4 py-6 border-b text-sm">
              <div className="cursor-pointer flex flex-col items-center text-red-600 hover:text-red-700">
                <Siren size={24} />
                <span className="mt-1">신고하기</span>
              </div>
              <div className="cursor-pointer flex flex-col items-center text-gray-600 hover:text-gray-700">
                <Ban size={24} />
                <span className="mt-1">차단하기</span>
              </div>
              <div className="cursor-pointer flex flex-col items-center text-blue-600 hover:text-blue-700">
                <Share2 size={24} />
                <span className="mt-1">공유하기</span>
              </div>
              <div className="cursor-pointer flex flex-col items-center text-yellow-600 hover:text-yellow-700">
                <Bookmark size={24} />
                <span className="mt-1">저장하기</span>
              </div>
            </div>
          )}

          <h4 className="font-medium">채팅 내용</h4>
          <p className="text-sm text-gray-600">이 사이드바는 더보기 버튼을 클릭하면 추가 메뉴가 나타납니다.</p>

          <div className="bg-purple-50 p-4 rounded border">
            <h5 className="font-medium text-purple-900 mb-2">사용 시나리오</h5>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• 채팅방 (신고, 차단, 공유)</li>
              <li>• 상품 상세 (공유, 찜, 신고)</li>
              <li>• 게시글 (수정, 삭제, 공유)</li>
              <li>• 사용자 프로필 (차단, 신고)</li>
            </ul>
          </div>

          <div className="bg-gray-100 p-3 rounded">
            <p className="text-sm">더보기 버튼(점 3개)을 클릭하면 상단에 추가 옵션 메뉴가 토글됩니다.</p>
          </div>
        </div>
      </Sidebar>
    </div>
  );
}
