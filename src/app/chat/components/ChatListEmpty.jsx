/* 
  2025-08-27
  채팅방 사이드바에서 생성된 채팅방이 없을 시 사용하는 컴포넌트
*/

import { RefreshCw } from "lucide-react";

export default function ChatListEmpty({ onRefresh, refreshing }) {
  return (
    <div className="text-center py-8">
      <p className="text-gray-500 mb-4">채팅방이 없습니다.</p>
      <p className="text-sm text-gray-400 mb-2">상품 상세에서 채팅을 시작하거나</p>
      <p className="text-sm text-gray-400">테스트 페이지에서 채팅방을 생성해보세요!</p>
      <div className="mt-4 space-y-2">
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          새로고침
        </button>
        <a href="/chat" className="text-blue-600 hover:text-blue-800 underline text-sm block">
          테스트 페이지로 이동
        </a>
      </div>
    </div>
  );
}
