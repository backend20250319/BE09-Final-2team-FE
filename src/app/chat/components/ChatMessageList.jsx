/* 
  2025-08-27
  채팅방 채팅(메시지)목록 컴포넌트
*/

import ChatMessageItem from "./ChatMessageItem";

export default function ChatMessageList({ messages, user, otherUserName, formatTime, formatFullDate, scrollRef }) {
  return (
    <div ref={scrollRef} className="overflow-auto p-5 h-[400px] bg-gray-200 flex flex-col">
      {messages.map((msg, idx) => {
        const isMine = msg.senderId === user?.id;
        return (
          <ChatMessageItem
            key={`${msg.sentAt || msg.timestamp}-${idx}-${msg.senderId}`}
            msg={msg}
            idx={idx}
            messages={messages}
            isMine={isMine}
            otherUserName={otherUserName}
            formatTime={formatTime}
            formatFullDate={formatFullDate}
          />
        );
      })}
    </div>
  );
}
