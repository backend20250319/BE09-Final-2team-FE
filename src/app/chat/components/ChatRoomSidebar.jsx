"use client";

import Sidebar from "@/components/common/Sidebar";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/useSidebar";
import { formatDateToString, formatStringToDate, numberWithCommas } from "@/utils/format";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function ChatRoomSidebar({ chat }) {
  const { close, closeAll } = useSidebar(`chatRoom_${chat.id}`);
  const chatListSidebar = useSidebar("chatList"); // ✅ 렌더 단계에서 미리 꺼내두기
  const [text, setText] = useState("");
  const [isSale, setIsSale] = useState(!!chat.isSale); // ✅ 판매 상태 로컬 관리
  const myId = "나";

  // ✅ 초기 메시지에도 isSale 포함 (일관성)
  const [messages, setMessages] = useState([
    {
      from: myId,
      text: "안녕하세요 아가옷이 너무 귀여워요~ 구매가능할까요?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      read: true,
      isSale: false,
    },
    {
      from: chat.name,
      text: chat.message,
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      read: true,
      isSale: false,
    },
  ]);

  const scrollRef = useRef(null);
  const router = useRouter();

  // 메시지 전송 (현재 판매 상태를 메시지에 함께 기록)
  const sendMessage = () => {
    if (!text.trim()) return;

    const newMessage = {
      from: myId,
      text,
      timestamp: new Date().toISOString(),
      read: false,
      isSale, // ✅ 전송 시점의 판매 상태 기록
    };

    setMessages((prev) => [...prev, newMessage]);
    setText("");

    // 스크롤 맨 아래로
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 0);
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (iso) => {
    const date = new Date(iso);
    return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  };

  const formatFullDate = (timestamp) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "";
    const dateString = formatDateToString(date);
    return formatStringToDate(dateString);
  };

  // 상품 클릭 시 사이드바 전부 닫고 이동
  const handleGoToReview = () => {
    try {
      closeAll();
      router.push(`/product/${chat.productId}`);
    } catch (err) {
      const safeErr = err instanceof Error ? err : new Error(String(err));
      console.error("페이지 이동 중 오류 발생:", safeErr);
    }
  };

  // 판매완료 처리: 상태 변경 + (옵션) 시스템 메시지 남기기
  const handleCompleteSale = () => {
    if (isSale) return;
    setIsSale(true);

    setMessages((prev) => [
      ...prev,
      {
        from: "system",
        text: "거래가 판매완료 상태로 전환되었습니다.",
        timestamp: new Date().toISOString(),
        read: true,
        isSale: true,
      },
    ]);

    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 0);
  };

  return (
    <Sidebar
      sidebarKey={`chatRoom_${chat.id}`}
      title={chat.name}
      trigger={
        <Button variant="ghost" className="flex items-center gap-4 w-full h-[86px]">
          <div className="w-[60px] h-[60px] bg-gray-200 rounded-full flex items-center justify-center">
            {chat.avatar ? (
              <Image
                src={chat.avatar}
                alt={chat.name}
                width={60}
                height={60}
                className="rounded-full w-[60px] h-[60px]"
              />
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
            <Image src={chat.productImg} alt="product" width={40} height={40} className="rounded w-10 h-10" />
          ) : (
            <span className="text-gray-500 text-xl">👤</span>
          )}
        </Button>
      }
      onBack={() => {
        close();
        chatListSidebar.open(); // ✅ 훅을 미리 꺼내서 사용
      }}
    >
      <div>
        {/* 상품 정보 + 판매완료 버튼 */}
        <div className="flex">
          <div onClick={handleGoToReview} className="flex items-center gap-4 w-full h-[40px] mb-3 cursor-pointer">
            {chat.productImg ? (
              <Image
                src={chat.productImg}
                alt="product"
                width={40}
                height={40}
                className="rounded w-10 h-10"
                onError={(e) => {
                  console.warn("이미지 로드 실패", e?.nativeEvent || e);
                }}
              />
            ) : (
              <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                없음
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex flex-col items-start text-sm">
                <span className="font-medium text-base text-gray-900 truncate">{chat.productName}</span>
                <span className="text-xs text-gray-500">{numberWithCommas(chat.productPrice)}원</span>
              </div>
            </div>
          </div>

          <Button className="cursor-pointer" onClick={handleCompleteSale} disabled={isSale}>
            {isSale ? "판매완료됨" : "판매완료"}
          </Button>
        </div>

        {/* 메시지 목록 */}
        <div className="flex flex-col gap-2">
          <div ref={scrollRef} className="overflow-auto p-5 h-[400px] bg-gray-200">
            {messages.map((msg, idx) => {
              const isMine = msg.from === myId;
              const isSystem = msg.from === "system";
              const showDate =
                idx === 0 ||
                formatDateToString(new Date(messages[idx].timestamp)) !==
                  formatDateToString(new Date(messages[idx - 1]?.timestamp));

              if (isSystem) {
                // 시스템 메시지 스타일
                return (
                  <div key={idx}>
                    {showDate && (
                      <div className="text-center text-xs text-gray-500 my-2">{formatFullDate(msg.timestamp)}</div>
                    )}
                    <div className="my-2 text-center">
                      <span className="inline-block text-xs bg-gray-300 text-gray-800 px-2 py-1 rounded">
                        {msg.text}
                      </span>
                    </div>
                  </div>
                );
              }

              return (
                <div key={idx}>
                  {showDate && (
                    <div className="text-center text-xs text-gray-500 my-2">{formatFullDate(msg.timestamp)}</div>
                  )}

                  <div className={`mb-2 flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div className={`${isMine ? "text-right" : "text-left"}`}>
                      {!isMine && <div className="text-sm text-gray-500 mb-1">{msg.from}</div>}
                      <div className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                        <div
                          className={`p-3 rounded break-all max-w-[250px] ${
                            isMine ? "bg-blue-300 text-left" : "bg-green-300"
                          }`}
                        >
                          {msg.text}
                          {/* 이 메시지 전송 시점에 판매완료 상태였다면 작은 뱃지 표기 */}
                          {msg.isSale && (
                            <div className="mt-1 text-[10px] inline-block bg-white/70 px-1.5 py-0.5 rounded">
                              판매완료 시점
                            </div>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-600 whitespace-nowrap">{formatTime(msg.timestamp)}</span>
                      </div>
                      {isMine && <div className="text-xs text-gray-600 mt-0.5">{msg.read ? "읽음 ✅" : "전송됨"}</div>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-[#85B3EB] rounded p-1.5">
            <p className="text-white text-sm">
              아이 물품 거래, 안전이 먼저입니다. 판매자 정보와 상품 상태를 꼼꼼히 확인하세요.
            </p>
          </div>

          {/* 입력창 */}
          <form onSubmit={handleSend} className="flex flex-col gap-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSale} // ✅ 로컬 상태 기준
              className="flex-1 border p-2 rounded resize-none"
              placeholder={isSale ? "판매가 완료되어 메시지를 보낼 수 없습니다." : "메시지를 입력해주세요"}
              maxLength={1000}
            />
            <div className="flex items-end justify-between">
              <span className="text-sm leading-5 text-gray-400">{text.length} / 1000</span>
              <button type="submit" className="w-6 h-6" disabled={!text.trim() || isSale}>
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
