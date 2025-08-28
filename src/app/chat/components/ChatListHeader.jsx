/* 
  2025-08-27
  채팅방 사이트바 헤더 컴포넌트
*/

import { RefreshCw } from "lucide-react";

export default function ChatListHeader({ chatCount, onRefresh, refreshing }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <span className="text-sm text-gray-600">채팅방 {chatCount}개</span>
      <button
        onClick={onRefresh}
        disabled={refreshing}
        className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        title="새로고침"
      >
        <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} />
        새로고침
      </button>
    </div>
  );
}
