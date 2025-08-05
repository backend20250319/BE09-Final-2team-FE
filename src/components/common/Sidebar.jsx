"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { ChevronLeft, X } from "lucide-react";
import { useState } from "react";

export default function Sidebar({
  title,
  trigger,
  children,
  width = "max-w-[600px]",
  titleClassName = "text-center",
  titleStyle = {}, // 인라인 스타일을 위한 옵션
  titleProps = {}, // 추가 props를 위한 옵션
  footer,
  onBack, // 뒤로가기 함수
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>{trigger}</div>

      <SheetContent side="right" className={`${width} px-5 pb-5 flex flex-col`}>
        <SheetHeader className="mb-4 pt-4">
          <div className="flex items-center justify-between relative">
            {/* 뒤로가기 버튼 */}
            <div className="flex items-center">
              {onBack && (
                <button
                  onClick={() => {
                    onBack();
                    setOpen(false);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="뒤로가기"
                >
                  <ChevronLeft />
                </button>
              )}
            </div>

            {/* 중앙 타이틀 */}
            <SheetTitle className={`${titleClassName}`} style={titleStyle} {...titleProps}>
              {title}
            </SheetTitle>

            {/* 닫기 버튼 */}
            <SheetClose className="p-1 hover:bg-gray-100 rounded-full transition-colors" aria-label="닫기">
              <X className="w-6 h-6" />
            </SheetClose>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto pr-2">{children}</div>

        {footer && <div className="border-t pt-4 mt-4">{footer}</div>}
      </SheetContent>
    </Sheet>
  );
}
