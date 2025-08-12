"use client";

import Sidebar from "@/components/common/Sidebar";
import { Button } from "@/components/ui/button";

export default function BackButtonSidebarExample() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">2. 뒤로가기 버튼 사이드바</h3>
      <p className="text-sm text-gray-600 mb-4">뒤로가기 버튼이 있는 사이드바입니다. 단계별 네비게이션에 유용합니다.</p>

      <Sidebar
        sidebarKey="withBack"
        title="상세 정보"
        trigger={
          <Button variant="outline" className="w-full">
            뒤로가기 버튼 사이드바 열기
          </Button>
        }
        onBack={true}
      >
        <div className="space-y-4">
          <h4 className="font-medium">상세 정보</h4>
          <p className="text-sm text-gray-600">이 사이드바는 뒤로가기 버튼이 있어서 이전 단계로 돌아갈 수 있습니다.</p>

          <div className="bg-blue-50 p-4 rounded border">
            <h5 className="font-medium text-blue-900 mb-2">사용 시나리오</h5>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 단계별 폼 입력</li>
              <li>• 상품 목록 → 상품 상세</li>
              <li>• 설정 메뉴 네비게이션</li>
              <li>• 계층적 정보 탐색</li>
            </ul>
          </div>

          <div className="bg-gray-100 p-3 rounded">
            <p className="text-sm">뒤로가기 버튼을 클릭하면 사이드바가 닫히고 이전 화면으로 돌아갑니다.</p>
          </div>
        </div>
      </Sidebar>
    </div>
  );
}
