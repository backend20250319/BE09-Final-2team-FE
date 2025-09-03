/* 
  2025-08-27
  채팅방 목록 사이드바 메인 컴포넌트
*/

import Sidebar from "@/components/common/Sidebar";
import { MessageCircleMore, RefreshCw } from "lucide-react";
import ChatRoomSidebar from "./ChatRoomSidebar";
import ChatRoomCard from "./ChatRoomCard";
import ChatListEmpty from "./ChatListEmpty";
import ChatListHeader from "./ChatListHeader";
import { useState, useEffect, useCallback } from "react";
import { useUser, /* useIsAuthenticated, */ useCheckAuthStatus } from "../../../store/userStore";
import { useSidebar } from "../../../hooks/useSidebar";
import { chatApi } from "@/app/chat/api/chatApi";

export default function ChatListSidebar({ trigger, children, sidebarKey = "chatList" }) {
  const [loading, setLoading] = useState(true); // 초기 로딩
  const [error, setError] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [chatRooms, setChatRooms] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false); // 초기화 완료
  const user = useUser();
  // const isAuthenticated = useIsAuthenticated();
  const checkAuthStatus = useCheckAuthStatus();
  const chatRoomSidebar = useSidebar("chatRoom");

  /** 채팅방 참여자 정보를 가져와서 otherUserNickname 설정 (백엔드에서 이미 제공하므로 제거 예정) */
  const loadParticipantNames = async (rooms, currentUserId) => {
    // 백엔드에서 이미 otherUserNickname과 otherUserProfileImageUrl을 제공하므로
    // 추가 API 호출 없이 바로 반환
    return rooms;
  };

  /** 채팅방 목록 조회 */
  const fetchChatRooms = useCallback(
    async (isRefresh = false) => {
      if (!user?.id) return; // 전이 상태에선 목록을 비우지 않고 조용히 반환

      if (isRefresh) {
        setRefreshing(true);
      } else if (!isInitialized) {
        setLoading(true);
      }
      setError(null);

      try {
        const response = await chatApi.getMyRooms();
        if (response?.data?.success) {
          const roomsData = response.data.data || [];

          // 참여자 정보를 가져와서 name 설정
          const roomsWithNames = await loadParticipantNames(roomsData, user.id);
          setChatRooms(roomsWithNames);
        } else {
          setError("채팅방 목록을 불러올 수 없습니다.");
          setChatRooms([]);
        }
      } catch (e) {
        console.error("채팅방 목록 조회 오류:", e);
        setError("채팅방 목록을 불러올 수 없습니다.");
        setChatRooms([]);
      } finally {
        if (isRefresh) setRefreshing(false);
        else if (!isInitialized) setLoading(false);
      }
    },
    [user?.id, isInitialized]
  );

  /** 수동 새로고침 */
  const handleRefresh = useCallback(async () => {
    await fetchChatRooms(true);
  }, [fetchChatRooms]);

  /** 초기화: 인증 확인 → userId 확보되면 fetch → 초기화 해제 */
  useEffect(() => {
    const initializeData = async () => {
      try {
        const authResult = await checkAuthStatus();
        const uid = authResult?.user?.id ?? user?.id;
        if (uid) {
          await fetchChatRooms(false);
        }
        // uid 없으면 전이 상태: 목록 비우지 않고 대기
      } catch (e) {
        console.error("초기화 오류:", e);
        setChatRooms([]); // 오류 시에만 비움
      } finally {
        setIsInitialized(true);
        setLoading(false);
      }
    };
    initializeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** 인증/유저 변경 시 재조회 (초기화 완료 후에만) */
  useEffect(() => {
    if (!isInitialized) return;
    // if (isAuthenticated && user?.id) {
    if (user?.id) {
      fetchChatRooms(false);
    } else {
      // 로그아웃 확정 시에만 비우고자 한다면 아래 주석 해제
      // setChatRooms([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, /* isAuthenticated, */ user?.id]);

  /** 외부 새로고침 이벤트 */
  useEffect(() => {
    const handleRefreshChatRooms = () => {
      // if (isAuthenticated && user?.id) fetchChatRooms(false);
      if (user?.id) fetchChatRooms(false);
    };
    window.addEventListener("refreshChatRooms", handleRefreshChatRooms);
    return () => {
      window.removeEventListener("refreshChatRooms", handleRefreshChatRooms);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, /* isAuthenticated, */ user?.id]);

  /** 채팅방 클릭 핸들러 */
  const handleChatClick = (chat) => {
    // 이전 채팅방 정보 완전 초기화
    setSelectedChat(null);

    // 잠시 대기 후 새로운 채팅방 정보 설정 (상태 초기화 완료 대기)
    setTimeout(() => {
      const chatData = {
        ...chat,
        roomId: chat.roomId, // roomId로 통일
        message: chat.lastMessage ?? chat.message,
        date: chat.lastSentAt ? new Date(chat.lastSentAt).toLocaleString() : chat.date ?? "",
        currentUserId: user?.id,
        currentUserNickname: user?.nickname || user?.name || user?.loginId || "사용자",
      };

      // 새로운 채팅방 정보 설정
      setSelectedChat(chatData);
      chatRoomSidebar.open();

      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("chatRoomOpened", { detail: { roomId: chat.roomId } }));
      }, 150);
    }, 100); // 100ms 대기하여 상태 초기화 완료
  };

  return (
    <>
      {/* ChatListSidebar */}
      <Sidebar
        sidebarKey={sidebarKey}
        title="채팅 목록"
        trigger={
          trigger ?? (
            <button className="flex items-center gap-1 cursor-pointer">
              <MessageCircleMore color="#000000" />
              <span className="text-sm">채팅하기</span>
            </button>
          )
        }
      >
        {/* children이 있으면 그대로 렌더링 */}
        {typeof children !== "undefined" ? (
          children
        ) : (
          <div>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
            )}

            {loading || !isInitialized ? (
              <div className="text-center py-8">
                <div className="text-lg">로딩 중...</div>
              </div>
            ) : chatRooms.length === 0 ? (
              <ChatListEmpty onRefresh={handleRefresh} refreshing={refreshing} />
            ) : (
              <div>
                <ChatListHeader chatCount={chatRooms.length} onRefresh={handleRefresh} refreshing={refreshing} />
                <div className="space-y-2">
                  {chatRooms.map((chat, index) => {
                    return (
                      <ChatRoomCard
                        key={`chat-${chat.roomId}`}
                        chat={chat}
                        isSelected={selectedChat?.roomId === chat.roomId}
                        onClick={handleChatClick}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </Sidebar>

      {/* ChatRoomSidebar */}
      {selectedChat && <ChatRoomSidebar chat={selectedChat} />}
    </>
  );
}
