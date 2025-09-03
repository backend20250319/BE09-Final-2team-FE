/* 
  2025-08-27
  채팅방 채팅(메시지) 입력 폼 컴포넌트
*/

import { forwardRef } from "react";

const ChatInput = forwardRef(({ text, setText, onSend, isSale, isConnected }, ref) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSend();
      }}
      className="flex flex-col gap-1"
    >
      <textarea
        ref={ref}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={!isConnected}
        className="flex-1 border p-2 rounded resize-none"
        placeholder={
          !isConnected
            ? "연결 중입니다..."
            : isSale
            ? "판매가 완료되었습니다. 추가 문의사항이 있으시면 말씀해주세요."
            : "메시지를 입력해주세요"
        }
        maxLength={1000}
      />
      <div className="flex items-end justify-between">
        <span className="text-sm leading-5 text-gray-400">{text.length} / 1000</span>
        <button type="submit" className="w-6 h-6" disabled={!text.trim() || !isConnected}>
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            className="w-full h-full fill-[#9CA3AF]"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8 256C8 119 119 8 256 8s248 111 248 248-111 248-248 248S8 393 8 256zm143.6 28.9l72.4-75.5V392c0 13.3 10.7 24 24 24h16c13.3 0 24-10.7 24-24V209.4l72.4 75.5c9.3 9.7 24.8 9.9 34.3.4l10.9-11c9.4-9.4 9.4-24.6 0-33.9L273 107.7c-9.4-9.4-24.6-9.4-33.9 0L106.3 240.4c-9.4 9.4-9.4 24.6 0 33.9l10.9 11c9.6 9.5 25.1 9.3 34.4-.4z" />
          </svg>
        </button>
      </div>
    </form>
  );
});

export default ChatInput;
