"use client";

import Sidebar from "@/components/common/Sidebar";
import { Button } from "@/components/ui/button";

export default function ClickableTitleSidebarExample() {
  const handleTitleClick = () => {
    alert("제목을 클릭했습니다! 이곳에서 페이지 이동이나 추가 동작을 수행할 수 있습니다.");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">5. 클릭 가능한 제목 사이드바</h3>
      <p className="text-sm text-gray-600 mb-4">
        제목을 클릭할 수 있는 사이드바입니다. 제목을 통한 네비게이션에 유용합니다.
      </p>

      <Sidebar
        sidebarKey="clickableTitle"
        title="사용자명 (클릭 가능)"
        trigger={
          <Button variant="outline" className="w-full">
            클릭 가능한 제목 사이드바 열기
          </Button>
        }
        titleClickable={true}
        onTitleClick={handleTitleClick}
      >
        <div className="space-y-4">
          <h4 className="font-medium">사용자 정보</h4>
          <p className="text-sm text-gray-600">
            제목을 클릭하면 해당 사용자의 상세 프로필 페이지로 이동할 수 있습니다.
          </p>

          <div className="bg-orange-50 p-4 rounded border">
            <h5 className="font-medium text-orange-900 mb-2">사용 시나리오</h5>
            <ul className="text-sm text-orange-800 space-y-1">
              <li>• 채팅방 제목 → 사용자 프로필</li>
              <li>• 상품 판매자 → 판매자 정보</li>
              <li>• 댓글 작성자 → 작성자 프로필</li>
              <li>• 알림 발신자 → 발신자 정보</li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                U
              </div>
              <div>
                <p className="font-medium">사용자명</p>
                <p className="text-sm text-gray-600">마지막 접속: 2시간 전</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded">
                <p className="font-medium text-lg">15</p>
                <p className="text-sm text-gray-600">판매 상품</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <p className="font-medium text-lg">4.8</p>
                <p className="text-sm text-gray-600">평점</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 p-3 rounded">
            <p className="text-sm">제목에 마우스를 올리면 커서가 포인터로 변경되고, 호버 효과가 적용됩니다.</p>
          </div>
        </div>
      </Sidebar>
    </div>
  );
}
