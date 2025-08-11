"use client";

import ChatListSidebar from "./components/ChatListSideBar";

export default function Page() {
  return (
    <>
      <ChatListSidebar sidebarKey="chatListDefault" />

      <ChatListSidebar
        trigger={<button className="text-blue-600 underline">문의하기</button>}
        sidebarKey="chatListInquiry"
      >
        <div className="p-4">
          <h3 className="text-lg font-bold">판매자에게 문의하기</h3>
          <p className="text-sm text-gray-600 mt-2">궁금한 점이 있다면 자유롭게 메시지를 보내보세요!</p>
        </div>
      </ChatListSidebar>
    </>
  );
}
