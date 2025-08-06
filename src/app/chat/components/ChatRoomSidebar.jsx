// components/chat/ChatRoomSidebar.jsx
"use client";

import Sidebar from "@/components/common/Sidebar";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatDateToString, formatStringToDate, numberWithCommas } from "@/utils/format";
import Link from "next/link";

export default function ChatRoomSidebar({ chat }) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([
    {
      from: chat.name,
      text: chat.message,
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      read: true,
    },
  ]);
  const scrollRef = useRef(null);
  const myId = "나";

  // 메시지 전송 처리
  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const newMessage = {
      from: myId,
      text,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setMessages((prev) => [...prev, newMessage]);
    setText("");

    // 메시지 전송 후 스크롤 하단으로 이동
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 0);
  };

  // Enter 키로 메시지 전송 처리
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  // 시간 포맷 함수 (오전/오후 시:분)
  const formatTime = (iso) => {
    const date = new Date(iso);
    return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  };

  // 날짜 포맷 함수 (YYYY년 MM월 DD일)
  const formatFullDate = (timestamp) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "";
    const dateString = formatDateToString(date);
    return formatStringToDate(dateString);
  };

  return (
    <Sidebar
      title={`${chat.name}`}
      trigger={
        // 채팅방 목록에 출력되는 미리보기 버튼
        <Button variant="ghost" className="flex items-center gap-4 w-full h-[86px]">
          <div className="w-[60px] h-[60px] bg-gray-200 rounded-full flex items-center justify-center">
            {chat.avatar ? (
              <Image src={chat.avatar} alt={chat.name} width={60} height={60} className="rounded-full" />
            ) : (
              <span className="text-gray-500 text-xl">👤</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex gap-2 items-center text-sm">
              <span className="font-medium text-base text-gray-900 truncate">{chat.name}</span>
              <span className="text-xs text-gray-500">{chat.date}</span>
            </div>
            <p className="text-sm text-left text-gray-600 truncate">{chat.message}</p>
          </div>
          {chat.productImg ? (
            <Image src={chat.productImg} alt="product" width={40} height={40} className="rounded" />
          ) : (
            <span className="text-gray-500 text-xl">👤</span>
          )}
        </Button>
      }
      onBack={true}
    >
      <div>
        {/* 채팅방 상단 상품 정보 */}
        {chat && (
          <div className="rounded-lg flex justify-between">
            {/* 상품 정보 링크 영역 */}
            <Link href="#" className="flex items-center gap-4 w-full h-[40px] mb-3 ">
              {/* 상품 이미지 */}
              <Image src={chat.productImg} alt="product" width={40} height={40} className="rounded" />

              {/* 상품명 + 가격 */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col items-start text-sm">
                  <span className="font-medium text-base text-gray-900 truncate">{chat.productName}</span>
                  <span className="text-xs text-gray-500">{numberWithCommas(chat.productPrice)}원</span>
                </div>
              </div>
            </Link>
            {/* 판매 완료 버튼 (isSale === true일 때 비활성화) */}
            <Button disabled={chat.isSale} onClick={() => console.log("클릭됨")}>
              판매완료
            </Button>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {/* 메시지 목록 */}
          <div ref={scrollRef} className="overflow-auto p-5 h-[470px] bg-gray-200">
            {messages.map((msg, idx) => {
              const isMine = msg.from === myId;
              const showDate =
                idx === 0 ||
                formatDateToString(new Date(messages[idx].timestamp)) !==
                  formatDateToString(new Date(messages[idx - 1]?.timestamp));

              return (
                <div key={idx}>
                  {/* 날짜 표시 */}
                  {showDate && (
                    <div className="text-center text-xs text-gray-500 my-2">{formatFullDate(msg.timestamp)}</div>
                  )}

                  {/* 메시지 박스 - 나 / 상대방 구분 */}
                  <div className={`mb-2 flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div className={`${isMine ? "text-right" : "text-left"}`}>
                      {/* 보낸 사람 이름 (상대방만 표시) */}
                      {!isMine && <div className="text-sm text-gray-500 mb-1">{msg.from}</div>}

                      {/* 메시지 + 시간 묶음 */}
                      <div className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                        <div
                          className={`p-3 rounded break-all max-w-[250px] ${isMine ? "bg-blue-300" : "bg-green-300"}`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[11px] text-gray-600 mb-0.5 whitespace-nowrap">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>

                      {/* 읽음 여부 (내 메시지일 때만 표시) */}
                      {isMine && <div className="text-xs text-gray-600 mt-0.5">{msg.read ? "읽음 ✅" : "전송됨"}</div>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 메시지 입력창 */}
          <form onSubmit={handleSend} className="flex flex-col gap-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={chat.isSale}
              className="flex-1 border p-2 rounded resize-none"
              placeholder="메시지를 입력해주세요"
              maxLength={1000}
            />
            <div className="flex items-end justify-between">
              <span className="text-sm leading-5 text-gray-400">{text.length} / 1000</span>
              <button type="submit" className="w-6 h-6" disabled={!text.trim()}>
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
        </div>
      </div>
    </Sidebar>
  );
}
