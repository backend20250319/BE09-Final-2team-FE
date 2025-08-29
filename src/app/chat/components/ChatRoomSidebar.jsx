"use client";

/* 
  2025-08-27
  채팅방 사이드바 메인 컴포넌트
*/

import Sidebar from "@/components/common/Sidebar";
import { useSidebar } from "@/hooks/useSidebar";
import { formatDateToString, formatStringToDate } from "@/utils/format";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect, useCallback } from "react";
import { useWebSocketManager } from "../hooks/useWebSocketManager";
import { useUser } from "../../../store/userStore";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import ChatProductInfo from "./ChatProductInfo";
import ChatActionMenu from "./ChatActionMenu";
import { chatAPI } from "../api/chatApi";

export default function ChatRoomSidebar({ chat, onClose }) {
  // chat: 채팅방 정보를 담고 있는 객체 (id, name, message, productId, productName, productPrice, productImg, avatar, date, userId 등)

  const { close, closeAll } = useSidebar("chatRoom"); // 현재 채팅방 사이드바 제어
  const chatListSidebar = useSidebar("chatList"); // 채팅 목록 사이드바 제어
  const [text, setText] = useState(""); // 메시지 입력 텍스트
  const [isSale, setIsSale] = useState(!!chat.isSale); // 판매 완료 상태 (로컬 관리)
  const [isAddBtn, setIsAddBtn] = useState(false); // 더보기 버튼 메뉴 표시 여부
  const [messages, setMessages] = useState([]); // 실제 메시지 목록
  const [loading, setLoading] = useState(true); // 메시지 로딩 상태
  const [otherUserName, setOtherUserName] = useState("상대방"); // 상대방 이름
  const [otherUser, setOtherUser] = useState(null); // 상대방 정보
  const user = useUser(); // 현재 사용자 정보

  // 사용자 이름 계산 (chat 객체에서 전달받은 사용자 정보 우선 사용)
  const senderName =
    chat.currentUserNickname || (user ? user.nickname || user.name || user.loginId || "사용자" : "사용자");

  // 읽음 처리할 메시지 ID들을 추적하는 상태
  const [unreadMessageIds, setUnreadMessageIds] = useState(new Set());

  // 메시지 수신 핸들러 (먼저 정의)
  const handleMessageReceived = (message) => {
    // 메시지에 고유 ID가 없으면 생성
    if (!message.id) {
      message.id = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // 읽음 처리 메시지인 경우
    if (message.messageType === "READ") {
      setMessages((prev) =>
        prev.map((msg) => {
          if (message.messageIds && message.messageIds.includes(msg.id)) {
            return { ...msg, read: true };
          }
          return msg;
        })
      );
      return;
    }

    // 내가 보낸 메시지가 아니면 읽지 않은 메시지로 추가
    if (message.senderId !== user?.id) {
      setUnreadMessageIds((prev) => new Set([...prev, message.id]));
    }

    setMessages((prev) => {
      const newMessages = [...prev, message];
      // 시간순으로 정렬 (오래된 메시지가 위에, 최신 메시지가 아래에)
      return newMessages.sort((a, b) => {
        const timeA = new Date(a.sentAt || a.timestamp || 0).getTime();
        const timeB = new Date(b.sentAt || b.timestamp || 0).getTime();
        return timeA - timeB;
      });
    });
  };

  // WebSocket 훅 사용 (chat 객체에서 전달받은 사용자 ID 우선 사용)
  const roomId = chat.roomId || chat.id;
  const userId = chat.currentUserId || user?.id;
  const {
    isConnected,
    error: wsError,
    sendMessage,
    joinRoom,
    markAsRead,
  } = useWebSocketManager(roomId, userId, handleMessageReceived);

  // 채팅방 참여자 정보 로드 (상대방 이름 가져오기)
  useEffect(() => {
    const loadParticipants = async () => {
      if (!roomId || !userId) return;

      try {
        const response = await chatAPI.getRoomParticipants(roomId);
        if (response.data.success) {
          const participants = response.data.data || [];

          // 현재 사용자가 아닌 다른 참여자를 찾아서 이름 설정
          const otherUser = participants.find((p) => p.userId !== userId);
          if (otherUser) {
            // 백엔드에서 제공하는 닉네임 정보 사용
            const nickname = otherUser.nickname || "상대방";
            setOtherUserName(nickname);
            setOtherUser(otherUser); // 상대방 정보 저장

            // chat 객체에 상대방 정보 추가
            chat.otherUserId = otherUser.userId;
            chat.otherUserNickname = nickname;
          }
        }
      } catch (error) {
        console.error("참여자 정보 로드 오류:", error);
      }
    };

    loadParticipants();
  }, [roomId, userId, chat]);

  // 기존 메시지 로드
  useEffect(() => {
    const loadMessages = async () => {
      if (!roomId || !userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await chatAPI.getMessages(roomId, 0, 50);
        if (response.data.success) {
          const loadedMessages = response.data.data.content || [];

          // 읽지 않은 메시지 ID들을 수집
          const unreadIds = new Set();
          loadedMessages.forEach((msg) => {
            if (msg.senderId !== user?.id && !msg.read) {
              unreadIds.add(msg.id);
            }
          });

          // 시간순으로 정렬 (오래된 메시지가 위에, 최신 메시지가 아래에)
          const sortedMessages = loadedMessages.sort((a, b) => {
            const timeA = new Date(a.sentAt || a.timestamp || 0).getTime();
            const timeB = new Date(b.sentAt || b.timestamp || 0).getTime();
            return timeA - timeB;
          });

          setUnreadMessageIds(unreadIds);
          setMessages(sortedMessages);

          // 메시지 로드 완료 후 스크롤을 최하단으로 이동
          scrollToBottom(100);
        }
      } catch (error) {
        console.error("메시지 로드 오류:", error);
        // 에러 시 빈 메시지 배열로 설정
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [roomId, userId, senderName, chat.otherUserNickname, chat.message, user?.id]);

  // 스크롤을 최하단으로 이동하는 함수
  const scrollToBottom = useCallback((delay = 100) => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, delay);
  }, []);

  // 읽음 처리 함수
  const handleMarkAsRead = useCallback(() => {
    if (unreadMessageIds.size > 0 && markAsRead) {
      const messageIdsArray = Array.from(unreadMessageIds);
      markAsRead(messageIdsArray);
      setUnreadMessageIds(new Set()); // 읽음 처리 후 초기화
    }
  }, [unreadMessageIds, markAsRead]);

  // WebSocket 연결 시 자동으로 방 입장
  useEffect(() => {
    if (isConnected && senderName) {
      joinRoom(senderName);

      // WebSocket 연결 후 스크롤을 최하단으로 이동
      scrollToBottom(100);
    }
  }, [isConnected, senderName, joinRoom, messages.length]);

  // 채팅방이 활성화될 때 읽음 처리
  useEffect(() => {
    if (isConnected && unreadMessageIds.size > 0) {
      // 약간의 지연을 두어 메시지 렌더링 완료 후 읽음 처리
      const timer = setTimeout(() => {
        handleMarkAsRead();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isConnected, handleMarkAsRead]);

  // 메시지 목록 스크롤 시 읽음 처리 (Intersection Observer 사용)
  useEffect(() => {
    if (!scrollRef.current || unreadMessageIds.size === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 메시지가 화면에 보이면 읽음 처리
            handleMarkAsRead();
          }
        });
      },
      { threshold: 0.5 } // 50% 이상 보일 때 읽음 처리
    );

    // 마지막 메시지들을 관찰
    const messageElements = scrollRef.current.querySelectorAll(".message-item");
    const lastMessages = Array.from(messageElements).slice(-3); // 마지막 3개 메시지

    lastMessages.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [messages, unreadMessageIds, handleMarkAsRead]);

  // 새 메시지가 추가될 때마다 스크롤을 최하단으로 이동
  useEffect(() => {
    if (messages.length > 0 && scrollRef.current) {
      // DOM 업데이트 후 스크롤 실행
      scrollToBottom(50);
    }
  }, [messages.length, scrollToBottom]); // messages.length가 변경될 때만 실행

  // 채팅방 입장 시 스크롤을 최하단으로 이동
  useEffect(() => {
    if (!loading && messages.length > 0 && scrollRef.current) {
      // 로딩이 완료되고 메시지가 있을 때 스크롤을 최하단으로 이동
      scrollToBottom(100);
    }
  }, [loading, messages.length, scrollToBottom]); // 로딩 상태와 메시지 개수가 변경될 때 실행

  // ChatListSideBar에서 채팅방 클릭 시 스크롤 이벤트 감지
  useEffect(() => {
    const handleChatRoomOpened = (event) => {
      const { roomId } = event.detail;
      const currentRoomId = chat.roomId || chat.id;

      // 현재 채팅방과 일치하는 경우에만 스크롤 실행
      if (roomId === currentRoomId && scrollRef.current) {
        scrollToBottom(100); // 약간 더 긴 지연으로 DOM 완전 로드 후 실행
      }
    };

    // 커스텀 이벤트 리스너 등록
    window.addEventListener("chatRoomOpened", handleChatRoomOpened);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("chatRoomOpened", handleChatRoomOpened);
    };
  }, [chat.roomId, chat.id, scrollToBottom]);

  // ChatRoomSidebar 마운트 시 스크롤 실행
  useEffect(() => {
    // 컴포넌트가 마운트되고 메시지가 로드된 후 스크롤 실행
    if (messages.length > 0 && !loading) {
      scrollToBottom(100); // 충분한 지연으로 모든 렌더링 완료 후 실행
    }
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  const scrollRef = useRef(null);
  const router = useRouter();

  // 메시지 전송 함수 (현재 판매 상태를 메시지에 함께 기록)
  const handleSendMessage = () => {
    if (!text.trim()) return;
    if (!userId) {
      console.error("사용자 정보가 없습니다.");
      return;
    }

    if (sendMessage(text, senderName)) {
      setText("");

      // 스크롤 맨 아래로 (DOM 업데이트 후 실행)
      scrollToBottom(100);
    }
  };

  // 시간 포맷팅 (HH:MM 형식)
  const formatTime = (iso) => {
    const date = new Date(iso);
    return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  };

  // 전체 날짜 포맷팅 (YYYY년 MM월 DD일 형식)
  const formatFullDate = (timestamp) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "";
    const dateString = formatDateToString(date);
    return formatStringToDate(dateString);
  };

  // 상품 클릭 시 상품 상세 페이지로 이동
  const handleGoToReview = () => {
    try {
      closeAll(); // 모든 사이드바 닫기
      router.push(`/product/${chat.productId}`); // 상품 상세 페이지로 이동
    } catch (err) {
      const safeErr = err instanceof Error ? err : new Error(String(err));
      console.error("페이지 이동 중 오류 발생:", safeErr);
    }
  };

  // 유저 이름 클릭 시 해당 유저의 마이페이지로 이동
  const handleGoToUserProfile = () => {
    try {
      closeAll(); // 모든 사이드바 닫기
      // chat.otherUserId를 우선적으로 사용, 없으면 fallback
      const targetUserId = chat.otherUserId || otherUser?.userId || "";
      router.push(`/mypage/${targetUserId}`); // 유저 마이페이지로 이동
    } catch (err) {
      const safeErr = err instanceof Error ? err : new Error(String(err));
      console.error("유저 페이지 이동 중 오류 발생:", safeErr);
    }
  };

  // 현재 사용자가 판매자인지 확인
  const isSeller = chat.sellerId === user?.id;

  // 판매완료 처리: 상태 변경 + 시스템 메시지 추가 (구매자만 가능)
  const handleCompleteSale = () => {
    // 판매자는 판매완료 처리할 수 없음
    if (isSeller) {
      console.log("판매자는 판매완료 처리를 할 수 없습니다.");
      return;
    }

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

    // 스크롤은 새 메시지 추가 useEffect에서 자동으로 처리됨
  };

  return (
    <Sidebar
      sidebarKey="chatRoom" // 채팅방 사이드바 키
      title={chat.otherUserNickname || otherUserName || "상대방"} // 채팅방 제목 (상대방 이름)
      titleClickable={true} // 제목 클릭 가능하게 설정
      onTitleClick={handleGoToUserProfile} // 제목 클릭 시 유저 프로필로 이동
      trigger={<div style={{ display: "none" }} />} // 숨겨진 트리거 (사이드바는 프로그래밍적으로 열림)
      onBack={() => {
        if (onClose) {
          onClose(); // 부모 컴포넌트에서 전달받은 닫기 함수 호출
        } else {
          close(); // 현재 채팅방 사이드바 닫기
          chatListSidebar.open(); // 채팅 목록 사이드바 열기
        }
      }}
      add={true} // 더보기 버튼 표시
      onAdd={() => setIsAddBtn(!isAddBtn)} // 더보기 버튼 클릭 시 메뉴 토글
      className="gap-0" // 사이드바 내부 간격 제거
    >
      <div>
        {/* 신고하기, 차단하기 */}
        <ChatActionMenu isVisible={isAddBtn} />

        {/* 상품 정보 + 판매완료 버튼 */}
        <ChatProductInfo
          chat={chat}
          isSale={isSale}
          onCompleteSale={handleCompleteSale}
          onGoToReview={handleGoToReview}
          isSeller={isSeller}
        />

        {/* 메시지 목록 */}
        <div className="flex flex-col gap-2">
          <ChatMessageList
            messages={messages}
            user={user}
            otherUserName={otherUserName}
            formatTime={formatTime}
            formatFullDate={formatFullDate}
            scrollRef={scrollRef}
          />

          <div className="bg-[#85B3EB] rounded p-1.5">
            <p className="text-white text-sm">
              아이 물품 거래, 안전이 먼저입니다. 판매자 정보와 상품 상태를 꼼꼼히 확인하세요.
            </p>
          </div>

          {/* 입력창 */}
          <ChatInput
            text={text}
            setText={setText}
            onSend={handleSendMessage}
            isSale={isSale}
            isConnected={isConnected}
          />
        </div>
      </div>
    </Sidebar>
  );
}
