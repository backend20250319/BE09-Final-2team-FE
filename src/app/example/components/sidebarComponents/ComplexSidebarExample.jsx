"use client";

import Sidebar from "@/components/common/Sidebar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Siren, Share2, Heart } from "lucide-react";

export default function ComplexSidebarExample() {
  const [showMenu, setShowMenu] = useState(false);

  const handleTitleClick = () => {
    alert("판매자 프로필로 이동합니다!");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">7. 복합 기능 사이드바</h3>
      <p className="text-sm text-gray-600 mb-4">
        여러 기능이 조합된 복합적인 사이드바입니다. 실제 서비스에서 자주 사용되는 형태입니다.
      </p>

      <Sidebar
        sidebarKey="complex"
        title="상품명 (클릭 가능)"
        trigger={
          <Button variant="outline" className="w-full">
            복합 기능 사이드바 열기
          </Button>
        }
        onBack={true}
        add={true}
        onAdd={() => setShowMenu(!showMenu)}
        titleClickable={true}
        onTitleClick={handleTitleClick}
        footer={
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">판매자</p>
              <p className="font-medium">판매자명</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">채팅하기</Button>
          </div>
        }
        className="max-w-[500px]"
      >
        <div className="space-y-4">
          {/* 더보기 메뉴 */}
          {showMenu && (
            <div className="flex justify-center items-center gap-6 px-4 py-6 border-b text-sm">
              <div className="cursor-pointer flex flex-col items-center text-red-600 hover:text-red-700">
                <Siren size={24} />
                <span className="mt-1">신고하기</span>
              </div>
              <div className="cursor-pointer flex flex-col items-center text-blue-600 hover:text-blue-700">
                <Share2 size={24} />
                <span className="mt-1">공유하기</span>
              </div>
              <div className="cursor-pointer flex flex-col items-center text-pink-600 hover:text-pink-700">
                <Heart size={24} />
                <span className="mt-1">찜하기</span>
              </div>
            </div>
          )}

          <h4 className="font-medium">상품 정보</h4>
          <p className="text-sm text-gray-600">이 사이드바는 여러 기능이 조합되어 있습니다.</p>

          <div className="bg-indigo-50 p-4 rounded border">
            <h5 className="font-medium text-indigo-900 mb-2">포함된 기능들</h5>
            <ul className="text-sm text-indigo-800 space-y-1">
              <li>• 뒤로가기 버튼 (onBack)</li>
              <li>• 더보기 메뉴 (add + onAdd)</li>
              <li>• 클릭 가능한 제목 (titleClickable + onTitleClick)</li>
              <li>• 푸터 (footer)</li>
              <li>• 커스텀 너비 (className)</li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
              <div className="w-16 h-16 bg-gray-300 rounded"></div>
              <div className="flex-1">
                <p className="font-medium">상품명</p>
                <p className="text-lg font-bold text-red-600">₩150,000</p>
                <p className="text-sm text-gray-600">상태: 판매중</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded">
                <p className="font-medium text-lg">4.8</p>
                <p className="text-sm text-gray-600">평점</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <p className="font-medium text-lg">12</p>
                <p className="text-sm text-gray-600">찜</p>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded">
              <h6 className="font-medium mb-2">상품 설명</h6>
              <p className="text-sm text-gray-600">
                이 상품은 매우 좋은 상태로 보관되어 있으며, 구매 후 만족하실 수 있도록 최선을 다하겠습니다.
              </p>
            </div>
          </div>

          <div className="bg-gray-100 p-3 rounded">
            <p className="text-sm">
              이 예시는 실제 상품 상세 페이지에서 사용할 수 있는 형태입니다. 제목 클릭 시 판매자 프로필로, 더보기 메뉴로
              추가 기능을 제공합니다.
            </p>
          </div>
        </div>
      </Sidebar>
    </div>
  );
}
