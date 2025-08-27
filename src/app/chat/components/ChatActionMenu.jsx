/* 
  2025-08-27
  채팅방 신고/차단 컴포넌트
*/

import { Ban, Siren } from "lucide-react";

export default function ChatActionMenu({ isVisible }) {
  if (!isVisible) return null;

  return (
    <div className="flex justify-center items-center gap-[40px] px-4 min-h-[70px] border-b text-[14px] text-jnGray-900">
      <div className="cursor-pointer flex flex-col items-center">
        <Siren size={28} />
        <p>신고하기</p>
      </div>
      <div className="cursor-pointer flex flex-col items-center ">
        <Ban size={28} />
        <p>차단하기</p>
      </div>
    </div>
  );
}
