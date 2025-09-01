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

export default function ChatRoomSidebar({ chat = null, productId = null, onClose, trigger }) {
  const { close, closeAll } = useSidebar("chatRoom");
  const chatListSidebar = useSidebar("chatList");

  const [text, setText] = useState("");
  const [isSale, setIsSale] = useState(false);
  const [isAddBtn, setIsAddBtn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [otherUserName, setOtherUserName] = useState("상대방");
  const [otherUser, setOtherUser] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);

  const user = useUser();
  const scrollRef = useRef(null);
  const router = useRouter();

  // ✅ 채팅방 생성 or 기존 방 설정
  useEffect(() => {
    const initChatRoom = async () => {
      try {
        // 상품 상세 페이지 → productId로 새 채팅방 생성
        if (productId && !chat && user?.id) {
          setCreatingRoom(true);
          const response = await chatApi.createRoom({
            productId,
            userId: user.id,
          });
          if (response.data.success) {
            setCurrentChat(response.data.data);
          } else {
            console.error("채팅방 생성 실패:", response.data.message);
          }
        }
        // 목록에서 클릭 → chat(생성된 방의 데이터 (기존 방 입장 시 사용)) 기존 방 열기
        else if (chat) {
          setCurrentChat(chat);
          if (chat.isSale) setIsSale(true);
        }
      } catch (err) {
        console.error("채팅방 초기화 오류:", err);
      } finally {
        setCreatingRoom(false);
      }
    };

    initChatRoom();
  }, [productId, chat, user?.id]);

  const roomId = currentChat?.roomId;
  const isSeller = currentChat?.sellerId && currentChat.sellerId === user?.id;

  const senderName = currentChat?.currentUserNickname || user?.nickname || user?.name || user?.loginId || "사용자";

  // const [unreadMessageIds, setUnreadMessageIds] = useState(new Set());

  // ✅ WebSocket
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

    // 메시지 중복 방지: 이미 존재하는 메시지인지 확인
    setMessages((prev) => {
      const existingMessage = prev.find((msg) => msg.id === message.id);
      if (existingMessage) {
        console.log("중복 메시지 무시:", message.id);
        return prev;
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
        // console.log("상대방 메시지 수신:", message);
        /*
        if (message.senderId !== user?.id) {
          setUnreadMessageIds((prev) => new Set([...prev, message.id]));
        }
        */
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

  // ✅ 참여자 로드
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

  // ✅ 메시지 로드
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

  const handleCompleteSale = () => {
    if (isSeller) return;
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
  };

  const handleSendMessage = async () => {
    if (!text.trim()) return;

    const messageContent = text.trim();
    setText("");

    // 임시 메시지 추가 (사용자에게 즉시 피드백 제공)
    const tempMessage = {
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      senderId: user?.id,
      senderName: senderName,
      content: messageContent,
      sentAt: new Date().toISOString(),
      isTemp: true,
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      // WebSocket을 통한 메시지 전송 (실패해도 계속 진행)
      const wsSuccess = sendMessage(messageContent, senderName);

      // HTTP API 호출 (DB 저장용)
      const response = await chatApi.sendMessage(roomId, {
        senderId: user?.id,
        senderName,
        message: messageContent,
      });

      // HTTP API 응답에서 메시지 ID를 받아서 임시 메시지 교체
      if (response.data.success && response.data.data) {
        const savedMessage = response.data.data;

        setMessages((prev) => {
          const filteredMessages = prev.filter((msg) => !msg.isTemp);
          return [...filteredMessages, savedMessage].sort(
            (a, b) => new Date(a.sentAt || a.timestamp || 0) - new Date(b.sentAt || b.timestamp || 0)
          );
        });
      }
    } catch (err) {
      console.error("메시지 전송 실패:", err);
      // 실패 시 임시 메시지 제거
      setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
      // 사용자에게 오류 알림
      alert("메시지 전송에 실패했습니다. 다시 시도해주세요.");
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
        if (targetUserId) router.push(`/mypage/${targetUserId}`);
      }}
      trigger={trigger || <div style={{ display: "none" }} />}
      onBack={() => {
        if (onClose) onClose();
        else {
          close();
          chatListSidebar.open();
        }
      }}
      add
      onAdd={() => setIsAddBtn(!isAddBtn)}
      className="gap-0"
    >
      <div>
        <ChatActionMenu isVisible={isAddBtn} />

        {creatingRoom ? (
          <div className="flex items-center justify-center p-8">
            <p className="text-gray-600">채팅방을 생성하고 있습니다...</p>
          </div>
        ) : currentChat ? (
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
