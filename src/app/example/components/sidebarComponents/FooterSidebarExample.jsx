"use client";

import Sidebar from "@/components/common/Sidebar";
import { Button } from "@/components/ui/button";

export default function FooterSidebarExample() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">6. 푸터 사이드바</h3>
      <p className="text-sm text-gray-600 mb-4">
        하단에 고정된 푸터가 있는 사이드바입니다. 총액, 버튼 등을 표시할 때 사용합니다.
      </p>

      <Sidebar
        sidebarKey="withFooter"
        title="장바구니"
        trigger={
          <Button variant="outline" className="w-full">
            푸터 사이드바 열기
          </Button>
        }
        footer={
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">총 금액</p>
              <p className="text-lg font-bold text-green-600">₩125,000</p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">구매하기</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <h4 className="font-medium">장바구니 상품</h4>
          <p className="text-sm text-gray-600">
            이 사이드바는 하단에 고정된 푸터가 있어서 총액과 구매 버튼을 항상 볼 수 있습니다.
          </p>

          <div className="bg-teal-50 p-4 rounded border">
            <h5 className="font-medium text-teal-900 mb-2">사용 시나리오</h5>
            <ul className="text-sm text-teal-800 space-y-1">
              <li>• 장바구니 (총액 + 구매 버튼)</li>
              <li>• 주문 확인 (총액 + 결제 버튼)</li>
              <li>• 설정 저장 (저장 버튼)</li>
              <li>• 폼 제출 (제출 버튼)</li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
              <div className="w-12 h-12 bg-gray-300 rounded"></div>
              <div className="flex-1">
                <p className="font-medium">상품명 1</p>
                <p className="text-sm text-gray-600">₩45,000</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="w-6 h-6 bg-gray-200 rounded">-</button>
                <span className="w-8 text-center">1</span>
                <button className="w-6 h-6 bg-gray-200 rounded">+</button>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
              <div className="w-12 h-12 bg-gray-300 rounded"></div>
              <div className="flex-1">
                <p className="font-medium">상품명 2</p>
                <p className="text-sm text-gray-600">₩80,000</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="w-6 h-6 bg-gray-200 rounded">-</button>
                <span className="w-8 text-center">1</span>
                <button className="w-6 h-6 bg-gray-200 rounded">+</button>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 p-3 rounded">
            <p className="text-sm">푸터는 사이드바 하단에 고정되어 있어서 스크롤해도 항상 보입니다.</p>
          </div>
        </div>
      </Sidebar>
    </div>
  );
}
