"use client";

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
import { chatApi } from "../api/chatApi";
import { productAPI } from "../../../lib/api";
import { TradeStatus } from "../../../enums/tradeStatus";

export default function ChatRoomSidebar({ chat = null, productId = null, onClose, trigger }) {
  const { close, closeAll } = useSidebar("chatRoom");
  const chatListSidebar = useSidebar("chatList");

  const [text, setText] = useState("");
  const [isSale, setIsSale] = useState(false);
  const [isAddBtn, setIsAddBtn] = useState(false);
  const [messages, setMessages] = useState([]);

  const [otherUserName, setOtherUserName] = useState("상대방");
  const [otherUser, setOtherUser] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [shouldSendInitialMessage, setShouldSendInitialMessage] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const user = useUser();
  const scrollRef = useRef(null);
  const chatInputRef = useRef(null);
  const router = useRouter();

  // 채팅방 생성 or 기존 방 설정
  const [roomCreated, setRoomCreated] = useState(false);
  const initRef = useRef(false); // useRef로 중복 실행 방지

  // 채팅방 변경 시 상태 초기화
  useEffect(() => {
    // 채팅방이 변경되면 모든 상태를 초기화
    if (chat || productId) {
      setText("");
      setIsSale(false);
      setIsAddBtn(false);
      setMessages([]);
      setOtherUserName("상대방");
      setOtherUser(null);
      setRoomCreated(false);
      setShouldSendInitialMessage(false);
      setIsSendingMessage(false);
      initRef.current = false;
    }
  }, [chat?.roomId, productId]); // roomId나 productId가 변경될 때마다 초기화

  // 채팅방 초기화 함수를 useCallback으로 메모이제이션
  const initChatRoom = useCallback(async () => {
    // 이미 초기화가 완료되었거나 진행 중인 경우 중단
    if (initRef.current || roomCreated) return;

    if (productId && !chat && user?.id) {
      initRef.current = true; // 초기화 시작 표시
      setRoomCreated(true); // 중복 실행 방지

      // 임시 채팅방 정보 생성 (실제 채팅방은 메시지 전송 시 생성)
      const tempChat = {
        productId,
        roomId: null, // 메시지 전송 시 실제 roomId 할당
        buyerId: user.id,
        sellerId: null, // 메시지 전송 시 실제 sellerId 할당
        isTemp: true,
      };
      setCurrentChat(tempChat);
      setShouldSendInitialMessage(true);
    } else if (chat) {
      setCurrentChat(chat);
      if (chat.isSale) setIsSale(true);
      setRoomCreated(true); // 기존 채팅방도 처리 완료 표시

      // 기존 채팅방인 경우 입력창 비우기
      setText("");
    }
  }, [productId, chat, user?.id, roomCreated]);

  useEffect(() => {
    initChatRoom();
  }, [initChatRoom]);

  // 상품 상태 확인 및 동기화
  useEffect(() => {
    const checkProductStatus = async () => {
      if (!currentChat?.productId) return;

      try {
        // 상품 상세 정보 조회하여 현재 상태 확인
        const response = await productAPI.getProductDetail(currentChat.productId);
        const product = response.data.data.currentProduct;

        // 판매완료 상태인지 확인
        if (product.tradeStatus === "SOLD") {
          setIsSale(true);
        }
      } catch (error) {
        console.error("상품 상태 확인 실패:", error);
      }
    };

    checkProductStatus();
  }, [currentChat?.productId]);

  const roomId = currentChat?.roomId;
  const isSeller = currentChat?.sellerId && currentChat.sellerId === user?.id;

  const senderName = currentChat?.currentUserNickname || user?.nickname || user?.name || user?.loginId || "사용자";

  // const [unreadMessageIds, setUnreadMessageIds] = useState(new Set());

  // WebSocket
  const {
    isConnected,
    error: wsError,
    sendMessage,
    joinRoom,
    // markAsRead,
  } = useWebSocketManager(roomId, (message) => {
    if (!message.id) {
      message.id = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    /*
    if (message.messageType === "READ") {
      setMessages((prev) => prev.map((msg) => (message.messageIds?.includes(msg.id) ? { ...msg, read: true } : msg)));
      return;
    }
    */

    // 메시지 중복 방지 및 임시 메시지 처리 (강화된 로직)
    setMessages((prev) => {
      // ID로 중복 체크 (가장 정확한 방법)
      const existingMessageById = prev.find((msg) => msg.id === message.id);
      if (existingMessageById) {
        console.log("ID 중복 메시지 무시:", message.id);
        return prev;
      }

      // 내용과 시간으로 중복 체크 (임시 메시지와 실제 메시지 구분)
      const existingMessageByContent = prev.find(
        (msg) =>
          msg.content === message.content &&
          msg.senderId === message.senderId &&
          Math.abs(
            new Date(msg.sentAt || msg.timestamp || 0).getTime() -
              new Date(message.sentAt || message.timestamp || 0).getTime()
          ) < 5000 // 5초 이내
      );

      if (existingMessageByContent && existingMessageByContent.isTemp) {
        console.log("임시 메시지를 실제 메시지로 교체:", message.id);
        // 임시 메시지 제거하고 실제 메시지 추가
        const filteredMessages = prev.filter((msg) => !msg.isTemp || msg.id !== existingMessageByContent.id);
        return [...filteredMessages, message].sort(
          (a, b) => new Date(a.sentAt || a.timestamp || 0) - new Date(b.sentAt || b.timestamp || 0)
        );
      }

      // 내가 보낸 메시지인 경우, 임시 메시지를 실제 메시지로 교체
      if (message.senderId === user?.id) {
        // 임시 메시지 제거하고 실제 메시지 추가
        const filteredMessages = prev.filter((msg) => !msg.isTemp);
        return [...filteredMessages, message].sort(
          (a, b) => new Date(a.sentAt || a.timestamp || 0) - new Date(b.sentAt || b.timestamp || 0)
        );
      } else {
        // 상대방 메시지인 경우
        return [...prev, message].sort(
          (a, b) => new Date(a.sentAt || a.timestamp || 0) - new Date(b.sentAt || b.timestamp || 0)
        );
      }
    });
  });

  useEffect(() => {
    if (isConnected && senderName && roomId) {
      joinRoom(senderName);
    }
  }, [isConnected, senderName, roomId, joinRoom]);

  // 참여자 로드
  useEffect(() => {
    const loadParticipants = async () => {
      if (!roomId) return;
      try {
        const response = await chatApi.getRoomParticipants(roomId);
        if (response.data.success) {
          const participants = response.data.data || [];
          const other = participants.find((p) => p.userId !== user?.id);
          if (other) {
            setOtherUserName(other.nickname || "상대방");
            setOtherUser(other);
            setCurrentChat((prev) => ({
              ...prev,
              otherUserId: other.userId,
              otherUserNickname: other.nickname,
            }));
          }
        }
      } catch (err) {
        console.error("참여자 로드 오류:", err);
      }
    };
    loadParticipants();
  }, [roomId, user?.id]);

  // 초기 메시지 입력창에 미리 작성 (새 채팅방 생성 시에만)
  useEffect(() => {
    // 새 채팅방 생성 시에만 초기 메시지 설정 (기존 채팅방에서는 제외)
    if (shouldSendInitialMessage && !isSeller && senderName && productId && !chat) {
      console.log("초기 메시지 설정 시작:", { shouldSendInitialMessage, isSeller, senderName, productId, chat });

      // 초기 메시지를 입력창에 미리 작성
      const initialMessage = "안녕하세요! 이 상품에 관심이 있어서 문의드립니다.";
      setText(initialMessage);
      setShouldSendInitialMessage(false);

      console.log("초기 메시지 설정 완료:", initialMessage);

      // 입력창에 포커스 주기
      setTimeout(() => {
        if (chatInputRef.current) {
          chatInputRef.current.focus();
          chatInputRef.current.select(); // 텍스트 전체 선택
          console.log("입력창 포커스 및 텍스트 선택 완료");
        }
      }, 100);
    }
  }, [shouldSendInitialMessage, isSeller, senderName, productId, chat]);

  // 메시지 로드
  useEffect(() => {
    const loadMessages = async () => {
      if (!roomId) {
        return;
      }
      try {
        const response = await chatApi.getMessages(roomId, 0, 50);
        if (response.data.success) {
          const loaded = response.data.data.content || [];
          // const unread = new Set(loaded.filter((m) => m.senderId !== user?.id && !m.read).map((m) => m.id));
          // setUnreadMessageIds(unread);
          setMessages(
            loaded.sort((a, b) => new Date(a.sentAt || a.timestamp || 0) - new Date(b.sentAt || b.timestamp || 0))
          );
          scrollToBottom(100);
        }
      } catch (err) {
        console.error("메시지 로드 오류:", err);
        setMessages([]);
      }
    };
    loadMessages();
  }, [roomId]);

  const scrollToBottom = useCallback((delay = 100) => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, delay);
  }, []);

  /*
  const handleMarkAsRead = useCallback(() => {
    if (unreadMessageIds.size > 0 && markAsRead) {
      markAsRead(Array.from(unreadMessageIds));
      setUnreadMessageIds(new Set());
    }
  }, [unreadMessageIds, markAsRead]);

  useEffect(() => {
    if (isConnected && unreadMessageIds.size > 0) {
      const timer = setTimeout(handleMarkAsRead, 500);
      return () => clearTimeout(timer);
    }
  }, [isConnected, handleMarkAsRead]);
  */

  useEffect(() => {
    if (messages.length > 0 && scrollRef.current) {
      scrollToBottom(50);
    }
  }, [messages.length, scrollToBottom]);

  // 채팅방 변경 시 스크롤을 최하단으로 강제 이동 (상태 초기화 후 실행)
  useEffect(() => {
    if (roomId && messages.length > 0 && !initRef.current) {
      // 상태 초기화가 완료된 후 스크롤 실행
      const attemptScroll = () => {
        if (scrollRef.current) {
          const container = scrollRef.current;

          if (container.scrollHeight > container.clientHeight) {
            container.scrollTop = container.scrollHeight;
          }
        }
      };

      // 상태 초기화 완료 후 스크롤 시도
      setTimeout(() => attemptScroll(1), 200);
      setTimeout(() => attemptScroll(2), 400);
      setTimeout(() => attemptScroll(3), 600);
    }
  }, [roomId, messages.length]);

  const handleCompleteSale = async () => {
    if (!isSeller) return; // 판매자가 아닌 경우 처리하지 않음
    if (isSale) return;

    // 디버깅을 위한 로그 추가
    // console.log("현재 사용자 정보:", user);
    // console.log("현재 채팅 정보:", currentChat);
    // console.log("상품 ID:", currentChat?.productId);

    if (!user?.id) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      // 판매자가 구매자 정보와 함께 판매완료 처리
      // 구매자 ID는 채팅방의 다른 참여자 ID로 설정
      const buyerId = currentChat.otherUserId || otherUser?.userId;

      // console.log("구매자 ID:", buyerId);
      // console.log("상품 ID:", currentChat.productId);

      if (!buyerId) {
        alert("구매자 정보를 찾을 수 없습니다.");
        return;
      }

      await productAPI.completeTrade(currentChat.productId, buyerId);

      setIsSale(true);

      // 판매완료 메시지를 구매자에게 전송
      const completionMessage = "상품 거래가 완료되었습니다. 감사합니다!";

      try {
        // WebSocket을 통한 실시간 메시지 전송만 사용 (백엔드에서 DB 저장 처리)
        const success = sendMessage(completionMessage, senderName);

        if (!success) {
          console.error("판매완료 메시지 WebSocket 전송 실패");
        } else {
          console.log("판매완료 메시지 전송 완료");
        }
      } catch (error) {
        console.error("판매완료 메시지 전송 실패:", error);
      }
    } catch (error) {
      console.error("판매완료 처리 실패:", error);

      // 더 자세한 에러 정보 출력
      if (error.response) {
        console.error("에러 응답:", error.response.data);
        console.error("에러 상태:", error.response.status);
        console.error("에러 헤더:", error.response.headers);
      }

      if (error.response?.status === 401) {
        alert("인증이 필요합니다. 다시 로그인해주세요.");
      } else {
        alert("판매완료 처리에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleSendMessage = async () => {
    if (!text.trim() || isSendingMessage) return;

    const messageContent = text.trim();
    setText("");
    setIsSendingMessage(true);

    // 전송 중인 메시지 ID를 추적하여 중복 방지
    const messageId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // 임시 메시지 추가 (사용자에게 즉시 피드백 제공)
    const tempMessage = {
      id: messageId,
      senderId: user?.id,
      senderName: senderName,
      content: messageContent,
      sentAt: new Date().toISOString(),
      isTemp: true,
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      // 임시 채팅방인 경우 자동 채팅방 생성 API 사용
      if (currentChat?.isTemp) {
        const response = await chatApi.sendMessageWithAutoRoom({
          senderId: user.id,
          senderName: senderName,
          message: messageContent,
          productId: currentChat.productId,
        });

        if (response.data.success) {
          // 실제 채팅방 정보로 업데이트
          const messageData = response.data.data;
          setCurrentChat((prev) => ({
            ...prev,
            roomId: messageData.roomId,
            isTemp: false,
          }));

          // 임시 메시지를 실제 메시지로 교체
          setMessages((prev) =>
            prev.map((msg) => (msg.id === messageId ? { ...msg, ...messageData, isTemp: false } : msg))
          );
        } else {
          throw new Error("채팅방 생성 실패");
        }
      } else {
        // 기존 채팅방인 경우 WebSocket 사용
        const success = sendMessage(messageContent, senderName);
        if (!success) {
          throw new Error("WebSocket 메시지 전송 실패");
        }
      }
    } catch (err) {
      console.error("메시지 전송 실패:", err);
      // 실패 시 임시 메시지 제거
      setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
      // 사용자에게 오류 알림
      alert("메시지 전송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSendingMessage(false);
    }
  };

  return (
    <Sidebar
      sidebarKey="chatRoom"
      title={currentChat?.otherUserNickname || otherUserName}
      titleClickable
      onTitleClick={() => {
        closeAll();
        const targetUserId = currentChat?.otherUserId || otherUser?.userId || "";
        if (targetUserId) router.push(`/user-profile/${targetUserId}`);
      }}
      trigger={trigger || <div style={{ display: "none" }} />}
      onBack={true}
      onCloseCallback={() => {
        if (onClose) {
          onClose();
        } else {
          chatListSidebar.open();
        }
        // 채팅방 목록 새로고침 이벤트 발생
        window.dispatchEvent(new CustomEvent("refreshChatRooms"));
      }}
      add
      onAdd={() => setIsAddBtn(!isAddBtn)}
      className="gap-0"
    >
      <div>
        <ChatActionMenu isVisible={isAddBtn} />

        {currentChat ? (
          <>
            <ChatProductInfo
              chat={currentChat}
              isSale={isSale}
              onCompleteSale={handleCompleteSale}
              onGoToReview={() => {
                closeAll();
                router.push(`/product/${currentChat?.productId}`);
              }}
              isSeller={isSeller}
            />

            <div className="flex flex-col gap-2">
              <ChatMessageList
                messages={messages}
                user={user}
                otherUserName={otherUserName}
                formatTime={(iso) =>
                  new Date(iso).toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }
                formatFullDate={(ts) => formatStringToDate(formatDateToString(new Date(ts)))}
                scrollRef={scrollRef}
              />

              <div className="bg-[#85B3EB] rounded p-1.5">
                <p className="text-white text-sm">
                  아이 물품 거래, 안전이 먼저입니다. 판매자 정보와 상품 상태를 꼼꼼히 확인하세요.
                </p>
              </div>

              <ChatInput
                ref={chatInputRef}
                text={text}
                setText={setText}
                onSend={handleSendMessage}
                isSale={isSale}
                isConnected={isConnected}
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center p-8">
            <p className="text-gray-600">채팅방 정보를 불러올 수 없습니다.</p>
          </div>
        )}
      </div>
    </Sidebar>
  );
}
