import Sidebar from "@/components/common/Sidebar";
import Image from "next/image";

export default function ChatSidebar({ trigger }) {
  const dummyChats = [
    { name: "보라빛새빛땅콩", message: "네", date: "7월 31일", avatar: "" },
    { name: "sisjxkenjx", message: "안녕하세요안녕하세요...", date: "7월 31일", avatar: "" },
    { name: "중고나라#9544736", message: "고객님?", date: "7월 21일", avatar: "/sample-avatar.png" },
  ];

  return (
    <Sidebar title="채팅" trigger={trigger}>
      {/* 상단 배너 */}
      <div className="bg-black text-white text-sm p-4 rounded-md mb-4 flex justify-between items-center">
        <div>
          앱 다운로드 받고 <br />더 빠르고 편리하게 채팅 이용하기
        </div>
        <Image src="/qr-placeholder.png" alt="QR" width={60} height={60} />
      </div>

      {/* 채팅 리스트 */}
      <ul className="space-y-4">
        {dummyChats.map((chat, index) => (
          <li key={index} className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              {chat.avatar ? (
                <Image src={chat.avatar} alt={chat.name} width={40} height={40} className="rounded-full" />
              ) : (
                <span className="text-gray-500 text-sm">👤</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-900 truncate">{chat.name}</span>
                <span className="text-xs text-gray-500">{chat.date}</span>
              </div>
              <p className="text-sm text-gray-600 truncate">{chat.message}</p>
            </div>
          </li>
        ))}
      </ul>
    </Sidebar>
  );
}
