/* 
  2025-08-27
  채팅목록에서 보여지는 개별 채팅방 카드 컴포넌트
  
  상품 데이터 구조:
  - chat.productName: 상품명
  - chat.productThumbnailUrl: 상품 이미지 URL
  - chat.productPrice: 상품 가격 (숫자)
  - chat.productId: 상품 ID (페이지 이동용)
  - chat.otherUserNickname: 상대방 닉네임
*/

import { getProfileImageUrl } from "@/utils/profileImageUtils";
import { User, Clock } from "lucide-react";
import Image from "next/image";

export default function ChatRoomCard({ chat, isSelected, onClick }) {
  // console.log("chat =====> ", chat);

  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
        isSelected ? "bg-blue-50 border-blue-200" : "border-gray-200"
      }`}
      onClick={() => onClick(chat)}
    >
      <div className="flex items-start space-x-3">
        {/* 왼쪽: 사용자 프로필 이미지 (원형) */}
        <div className="flex-shrink-0">
          <Image
            src={getProfileImageUrl(chat.otherUserProfileImageUrl, chat.otherUserId)}
            alt="profile"
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover"
            onError={(e) => {
              console.warn("프로필 이미지 로드 실패", e?.nativeEvent || e);
              // 이미지 로드 실패 시 기본 아이콘으로 대체
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        </div>

        {/* 중앙: 채팅 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-gray-900 truncate text-sm">
              {chat.otherUserNickname || chat.name || "상대방"}
            </h3>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                {chat.lastSentAt
                  ? new Date(chat.lastSentAt).toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : chat.date || "최근"}
              </span>
            </div>
          </div>

          {/* 메시지 미리보기 */}
          <p className="text-xs text-gray-600 truncate">{chat.lastMessage || chat.message || "메시지가 없습니다."}</p>

          {/* 읽지 않은 메시지 수 */}
          {/* {chat.unreadCount > 0 && (
            <Badge variant="destructive" className="mt-1 text-xs px-1.5 py-0.5">
              {chat.unreadCount}
            </Badge>
          )} */}
        </div>

        {/* 오른쪽: 상품 이미지 */}
        <div className="flex-shrink-0">
          {chat.productThumbnailUrl ? (
            <Image
              src={chat.productThumbnailUrl}
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
        </div>
      </div>
    </div>
  );
}
