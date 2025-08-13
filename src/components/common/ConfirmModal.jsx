"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// 모달 타입 정의
export const MODAL_TYPES = {
  CONFIRM_CANCEL: "confirm_cancel", // 취소/확인 버튼 모두 있는 모달
  CONFIRM_ONLY: "confirm_only", // 확인 버튼만 있는 모달
};

export default function ConfirmModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  type = MODAL_TYPES.CONFIRM_CANCEL,
  confirmText = "확인",
  cancelText = "취소",
  confirmButtonStyle = "min-w-[90px] min-h-10 bg-[#85B3EB] hover:bg-[#65A2EE]",
}) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="w-[478px] min-h-[234px] flex flex-col justify-center items-center">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
        </DialogHeader>
        <div
          className="py-4 text-base text-gray-600 text-center flex-1 flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: message }}
        />
        <DialogFooter className="w-full">
          {type === MODAL_TYPES.CONFIRM_ONLY ? (
            // 확인 버튼만 있는 모달
            <div className="flex justify-center">
              <Button onClick={onConfirm} className={`min-w-[120px] min-h-10 ${confirmButtonStyle}`}>
                {confirmText}
              </Button>
            </div>
          ) : (
            // 취소/확인 버튼이 모두 있는 모달
            <div className="flex justify-end gap-2">
              <Button
                onClick={onCancel}
                className="min-w-[90px] min-h-10 bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200"
              >
                {cancelText}
              </Button>
              <Button onClick={onConfirm} className={`min-w-[90px] min-h-10 ${confirmButtonStyle}`}>
                {confirmText}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
