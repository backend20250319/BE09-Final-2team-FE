"use client";

import Sidebar from "@/components/common/Sidebar";
import { Button } from "@/components/ui/button";

export default function BasicSidebarExample() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">1. 기본 사이드바</h3>
      <p className="text-sm text-gray-600 mb-4">
        가장 간단한 사이드바 사용 예시입니다. 기본적인 제목과 내용만 포함됩니다.
      </p>

      <Sidebar
        sidebarKey="basic"
        title="기본 제목"
        trigger={
          <Button variant="outline" className="w-full">
            기본 사이드바 열기
          </Button>
        }
      >
        <div className="space-y-4">
          <h4 className="font-medium">기본 내용</h4>
          <p className="text-sm text-gray-600">
            이것은 가장 기본적인 사이드바 예시입니다. 제목과 내용만 포함되어 있으며, 추가적인 기능은 없습니다.
          </p>
          <div className="bg-gray-100 p-3 rounded">
            <p className="text-sm">
              • 단순한 정보 표시
              <br />
              • 간단한 설명
              <br />• 기본적인 레이아웃
            </p>
          </div>
        </div>
      </Sidebar>
    </div>
  );
}
