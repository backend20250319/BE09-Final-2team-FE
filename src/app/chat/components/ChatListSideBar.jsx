// components/chat/ChatListSidebar.jsx

import Sidebar from "@/components/common/Sidebar";
import { MessageCircleMore } from "lucide-react";
import ChatRoomSidebar from "./ChatRoomSidebar";

export default function ChatListSidebar({ trigger }) {
  // MongoDB에서 받은 채팅방 리스트 더미 (상품 ID만 포함)
  const chatRoomData = [
    {
      id: 101,
      opponentId: "user1",
      name: "김철수",
      avatar: "",
      message: "안녕하세요, 상품 문의드립니다.",
      date: "7월 28일",
      productId: "p101",
    },
    {
      id: 102,
      opponentId: "user2",
      name: "이영희",
      avatar: "",
      message: "구매하고 싶어요. 아직 판매 중인가요?",
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
      productName: "아디다스 백팩",
      productPrice: 35000,
      isSale: true,
    },
  };

  return (
    // ChatListSidebar.jsx
    <Sidebar
      sidebarKey="chatList"
      title="채팅 목록"
      trigger={
        <button className="flex items-center gap-1 cursor-pointer">
          <MessageCircleMore color="#000000" />
          <span className="text-sm">채팅하기</span>
        </button>
      }
    >
      <ul className="[&>li]:border-b">
        {chatRoomData.map((chat) => (
          <li key={chat.id}>
            <ChatRoomSidebar chat={{ ...chat, ...productMap[chat.productId] }} />
          </li>
        ))}
      </ul>
    </Sidebar>
  );
}
