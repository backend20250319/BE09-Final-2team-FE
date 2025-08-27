/* 
  2025-08-27
  채팅목록에서 보여지는 개별 채팅방 카드 컴포넌트
  
  상품 데이터 구조:
  - chat.productName: 상품명
  - chat.productImg: 상품 이미지 URL
  - chat.productPrice: 상품 가격 (숫자)
  - chat.productId: 상품 ID (페이지 이동용)
*/

import { User, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { numberWithCommas } from "@/utils/format";
import Image from "next/image";

export default function ChatRoomCard({ chat, isSelected, onClick }) {
  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
        isSelected ? "bg-blue-50 border-blue-200" : "border-gray-200"
      }`}
      onClick={() => onClick(chat)}
    >
      <div className="flex items-start space-x-3">
        {/* 상품 이미지 또는 기본 아이콘 */}
        {chat.productImg ? (
          <Image
            src={chat.productImg}
            alt="product"
            width={48}
            height={48}
            className="rounded-lg w-12 h-12 object-cover"
            onError={(e) => {
              console.warn("상품 이미지 로드 실패", e?.nativeEvent || e);
            }}
          />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
            <User className="w-6 h-6 text-gray-500" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 truncate">{chat.name || "상대방"}</h3>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                {chat.lastSentAt ? new Date(chat.lastSentAt).toLocaleDateString() : chat.date || "최근"}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 truncate mt-1">{chat.productName || "테스트 상품"}</p>
          {/* 가격 정보 추가 */}
          {chat.productPrice && (
            <p className="text-xs text-gray-500 truncate mt-0.5">{numberWithCommas(chat.productPrice)}원</p>
          )}
          <p className="text-xs text-gray-500 truncate mt-1">
            {chat.lastMessage || chat.message || "메시지가 없습니다."}
          </p>
          {chat.unreadCount > 0 && (
            <Badge variant="destructive" className="mt-1 text-xs">
              {chat.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
