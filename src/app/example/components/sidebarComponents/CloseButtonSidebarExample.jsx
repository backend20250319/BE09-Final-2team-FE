"use client";

import Sidebar from "@/components/common/Sidebar";
import { Button } from "@/components/ui/button";

export default function CloseButtonSidebarExample() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">3. 닫기 버튼 사이드바</h3>
      <p className="text-sm text-gray-600 mb-4">
        닫기 버튼(X)이 있는 사이드바입니다. 독립적인 모달처럼 사용할 수 있습니다.
      </p>

      <Sidebar
        sidebarKey="withClose"
        title="설정"
        trigger={
          <Button variant="outline" className="w-full">
            닫기 버튼 사이드바 열기
          </Button>
        }
        onClose={true}
      >
        <div className="space-y-4">
          <h4 className="font-medium">설정 메뉴</h4>
          <p className="text-sm text-gray-600">이 사이드바는 우측 상단에 X 버튼이 있어서 언제든지 닫을 수 있습니다.</p>

          <div className="bg-green-50 p-4 rounded border">
            <h5 className="font-medium text-green-900 mb-2">사용 시나리오</h5>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• 설정 메뉴</li>
              <li>• 독립적인 정보 표시</li>
              <li>• 임시 작업 패널</li>
              <li>• 도움말 또는 가이드</li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="text-sm">다크 모드</span>
              <input type="checkbox" className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="text-sm">알림 설정</span>
              <input type="checkbox" className="w-4 h-4" defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="text-sm">자동 저장</span>
              <input type="checkbox" className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Sidebar>
    </div>
  );
}
