/* 
  2025-08-27
  채팅방 개별 채팅(메시지) 컴포넌트
*/

import { formatDateToString } from "@/utils/format";

export default function ChatMessageItem({ msg, idx, messages, isMine, otherUserName, formatTime, formatFullDate }) {
  const isSystem = msg.from === "system";
  const showDate =
    idx === 0 ||
    formatDateToString(new Date(messages[idx].sentAt || messages[idx].timestamp)) !==
      formatDateToString(new Date(messages[idx - 1]?.sentAt || messages[idx - 1]?.timestamp));

  // 고유한 키 생성: sentAt + index + senderId
  const uniqueKey = `${msg.sentAt || msg.timestamp}-${idx}-${msg.senderId}`;

  if (isSystem) {
    // 시스템 메시지 스타일
    return (
      <div key={uniqueKey}>
        {showDate && (
          <div className="text-center text-xs text-gray-500 my-2">{formatFullDate(msg.sentAt || msg.timestamp)}</div>
        )}
        <div className="my-2 text-center">
          <span className="inline-block text-xs bg-gray-300 text-gray-800 px-2 py-1 rounded">{msg.text}</span>
        </div>
      </div>
    );
  }

  return (
    <div key={uniqueKey} className="message-item">
      {showDate && (
        <div className="text-center text-xs text-gray-500 my-2">{formatFullDate(msg.sentAt || msg.timestamp)}</div>
      )}

      <div className={`mb-2 flex ${isMine ? "justify-end" : "justify-start"}`}>
        <div className={`${isMine ? "text-right" : "text-left"}`}>
          {!isMine && <div className="text-sm text-gray-500 mb-1">{otherUserName}</div>}
          <div className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
            <div
              className={`p-3 rounded break-all max-w-[250px] ${isMine ? "bg-blue-300 text-left" : "bg-green-300"} ${
                msg.isTemp ? "opacity-70" : ""
              }`}
            >
              {msg.text || msg.content || msg.message}
              {/* 이 메시지 전송 시점에 판매완료 상태였다면 작은 뱃지 표기 */}
              {msg.isSale && (
                <div className="mt-1 text-[10px] inline-block bg-white/70 px-1.5 py-0.5 rounded">판매완료 시점</div>
              )}
              {/* 임시 메시지 표시 */}
              {msg.isTemp && (
                <div className="mt-1 text-[10px] inline-block bg-yellow-400/70 px-1.5 py-0.5 rounded">전송 중...</div>
              )}
            </div>
            <span className="text-[11px] text-gray-600 whitespace-nowrap">
              {formatTime(msg.sentAt || msg.timestamp)}
            </span>
          </div>
          {/* {isMine && (
            <div className="text-xs text-gray-600 mt-0.5">
              {msg.isTemp ? "전송 중..." : msg.read ? "읽음 ✅" : "전송됨"}
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}
