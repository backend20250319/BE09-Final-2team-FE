"use client";

import Sidebar from "@/components/common/Sidebar";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import React, { useState } from "react";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useSidebar } from "@/hooks/useSidebar";

const checkboxStyles = `
  .withdrawal-checkbox:checked {
    background-color: #85b3eb;
    border-color: #85b3eb;
  }
  
  .withdrawal-checkbox:checked::after {
    content: "✓";
    position: absolute;
    top: -2px;
    left: 2px;
    color: #ffffff;
    font-size: 12px;
    font-weight: bold;
  }
`;

export default function WithdrawlSidebar(props) {
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // useSidebar 훅 사용
  const { close, closeAll } = useSidebar("withdrawal");

  // 체크박스 상태 초기화 함수
  const resetCheckboxes = () => {
    setAgree1(false);
    setAgree2(false);
  };

  // 두 체크박스가 모두 체크되었는지 확인
  const isAllChecked = agree1 && agree2;

  const handleWithdrawal = () => {
    setShowModal(true);
  };

  const handleCancelWithdrawal = () => {
    setShowModal(false);
  };

  // 뒤로가기 버튼 클릭 시 체크박스 초기화
  const handleBackClick = () => {
    resetCheckboxes();
    close();
  };

  const handleConfirmWithdrawal = () => {
    // 실제 탈퇴 로직 구현
    console.log("회원 탈퇴 처리");
    setShowModal(false);
    alert("회원탈퇴 완료");
    // 사이드바 닫기
    closeAll();
    handleBackClick();
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: checkboxStyles }} />
      <Sidebar
        sidebarKey="withdrawal"
        trigger={props.trigger}
        title={"회원 탈퇴"}
        onBack
        onCloseCallback={resetCheckboxes}
        footerBorder={false}
        footer={
          <div className="flex justify-center gap-9">
            <Button
              variant={"outline"}
              className="text-gray-600"
              onClick={() => {
                resetCheckboxes();
                close();
                closeAll();
              }}
            >
              다시 생각해 볼께요
            </Button>
            <Button
              className={`bg-red-600 hover:bg-red-700 text-white ${
                !isAllChecked ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!isAllChecked}
              onClick={handleWithdrawal}
            >
              회원탈퇴
            </Button>
          </div>
        }
      >
        <div>
          <div className="flex flex-col items-center justify-center gap-2">
            <h2 className="text-2xl">정말 탈퇴하시겠어요?</h2>
            <p className="text-base text-red-700">탈퇴하시면 소중한 데이터들이 모두 삭제됩니다.</p>
          </div>
          <div>
            <div className="flex gap-2 pt-5">
              <Check color="#5A8AEF" />
              <p className="font-bold">탈퇴 시 삭제되는 정보</p>
            </div>
            <div className="mt-4">
              <table className="w-full border-collapse border border-gray-300">
                <tbody className="text-sm">
                  <tr className="border-b border-gray-300">
                    <th className="w-[150px] text-center bg-gray-50 px-4 py-3 font-medium text-gray-700 border-r border-gray-300">
                      개인정보
                    </th>
                    <td className="px-4 py-3 text-gray-600">
                      이름, 전화번호, 주소, 프로필 사진은 법령상 별도 보관 의무가 없는 경우 즉시 삭제
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <th className="w-[150px] bg-gray-50 px-4 py-3 text-center font-medium text-gray-700 border-r border-gray-300">
                      거래내역
                    </th>
                    <td className="px-4 py-3 text-gray-600">
                      판매/구매내역, 찜한 상품은 통계·분석 목적으로만 익명화 보관
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <th className="w-[150px] bg-gray-50 px-4 py-3 text-center font-medium text-gray-700 border-r border-gray-300">
                      소통기록
                    </th>
                    <td className="px-4 py-3 text-gray-600">
                      채팅 메시지, 리뷰, 댓글은 작성자 ID를 '탈퇴회원'으로 변경하여 익명화
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <th className="w-[150px] bg-gray-50 px-4 py-3 text-center font-medium text-gray-700 border-r border-gray-300">
                      커뮤니티
                    </th>
                    <td className="px-4 py-3 text-gray-600">
                      작성한 글, 좋아요는 게시판 성격에 따라 삭제 또는 익명화 처리
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <th className="w-[150px] bg-gray-50 px-4 py-3 text-center font-medium text-gray-700 border-r border-gray-300">
                      법적 보관 의무
                    </th>
                    <td className="px-4 py-3 text-gray-600">
                      전자상거래법 등 관련 법령에 따라 결제/환불 기록 5년, 소비자 불만·분쟁처리 기록 3년 보관
                    </td>
                  </tr>
                  <tr>
                    <th className="w-[150px] bg-gray-50 px-4 py-3 text-center font-medium text-gray-700 border-r border-gray-300">
                      백업 데이터
                    </th>
                    <td className="px-4 py-3 text-gray-600">
                      운영 DB 삭제 후 백업 서버에 남은 데이터도 일정 주기로 완전 삭제
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-6">
                <div className="flex items-start gap-2">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="agree-1"
                      checked={agree1}
                      onChange={(e) => setAgree1(e.target.checked)}
                      className="withdrawal-checkbox mt-1 w-4 h-4 appearance-none border border-gray-300 rounded bg-white relative"
                    />
                  </div>
                  <label htmlFor="agree-1" className="text-sm text-gray-700 leading-relaxed select-none">
                    위 안내사항을 모두 확인했으며, 탈퇴 후 데이터 복구가 불가능함을 이해했습니다.
                  </label>
                </div>
                <div className="flex items-start gap-2">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="agree-2"
                      checked={agree2}
                      onChange={(e) => setAgree2(e.target.checked)}
                      className="withdrawal-checkbox mt-1 w-4 h-4 appearance-none border border-gray-300 rounded bg-white relative"
                    />
                  </div>
                  <label htmlFor="agree-2" className="text-sm text-gray-700 leading-relaxed select-none">
                    진행 중인 거래가 없으며, 탈퇴에 따른 모든 책임은 본인에게 있음을 동의합니다.
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Sidebar>

      <ConfirmModal
        open={showModal}
        title="최종 확인"
        message="정말로 회원 탈퇴를 진행하시겠습니까?<br/>이 작업은 되돌릴 수 없습니다."
        onConfirm={handleConfirmWithdrawal}
        onCancel={handleCancelWithdrawal}
        confirmText="탈퇴하기"
        cancelText="취소"
        confirmButtonStyle="bg-red-600 hover:bg-red-700 text-white"
      />
    </>
  );
}
