// components/chat/ChatListSidebar.jsx

import Sidebar from "@/components/common/Sidebar";
import { MessageCircleMore } from "lucide-react";
import ChatRoomSidebar from "./ChatRoomSidebar";

export default function ChatListSidebar({ trigger, children, sidebarKey = "chatList" }) {
  // MongoDB에서 받은 채팅방 리스트 더미 (상품 ID만 포함)
  const chatRoomData = [
    {
      id: 101,
      opponentId: "user1",
      name: "김철수",
      avatar: "",
      message: "안녕하세요~ 상품은 미사용 제품이고요 네고는 많이 못해드립니다!",
      date: "7월 28일",
      productId: "p101",
    },
    {
      id: 102,
      opponentId: "user2",
      name: "이영희",
      avatar: "",
      message: "아 넵 안녕하세요~",
      date: "7월 29일",
      productId: "p102",
    },
  ];

  // 상품 정보는 상품 API에서 가져오는 구조지만, 여기서는 더미로 흉내
  const productMap = {
    p101: {
      productImg: "/images/text1.png",
      productName: "나이키 슈즈",
      productPrice: 20000,
      isSale: false,
    },
    p102: {
      productImg: "/images/text2.png",
      productName: "DSLR 카메라",
      productPrice: 35000,
      isSale: false,
    },
  };

  return (
    // ChatListSidebar.jsx
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
      {/* children이 있으면 그대로 렌더링, 없으면 기본 UI */}
      {typeof children !== "undefined" ? (
        children
      ) : (
        // 기본 UI
        <ul>
          {chatRoomData.map((chat) => (
            <li key={chat.id}>
              <ChatRoomSidebar chat={{ ...chat, ...productMap[chat.productId] }} />
            </li>
          ))}
        </ul>
      )}
    </Sidebar>
  );
}
