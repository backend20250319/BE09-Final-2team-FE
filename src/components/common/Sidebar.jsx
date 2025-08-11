"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { ChevronLeft, X } from "lucide-react";
import { useSidebar } from "@/hooks/useSidebar";

export default function Sidebar({
  sidebarKey,
  title,
  trigger,
  children,
  className = "pb-5 flex flex-col",
  titleClassName = "text-center",
  titleStyle = {},
  titleProps = {},
  footer,
  onBack = false,
  onClose = false,
}) {
  const { isOpen, open, close, closeAll } = useSidebar(sidebarKey);

  return (
    <>
      <div onClick={open}>{trigger}</div>

      <Sheet
        open={isOpen}
        onOpenChange={(val) => {
          if (val) {
            closeAll(); // 모든 사이드바 닫고
            open(); // 이 사이드바만 열기
          } else {
            close();
          }
        }}
      >
        <SheetContent side="right" className={`${className} max-w-[600px]`}>
          <SheetHeader className="pt-4 border-b">
            <div className="flex items-center justify-between relative">
              {onBack ? (
                <button onClick={close} className="p-1 hover:bg-gray-100 rounded-full" aria-label="뒤로가기">
                  <ChevronLeft />
                </button>
              ) : (
                <div className="w-6 h-6" />
              )}
              <SheetTitle className={titleClassName} style={titleStyle} {...titleProps}>
                {title}
              </SheetTitle>
              {onClose ? (
                <SheetClose className="pr-5 hover:bg-gray-100 rounded-full" aria-label="닫기">
                  <X className="w-6 h-6" />
                </SheetClose>
              ) : (
                <div className="w-6 h-6" />
              )}
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-5">{children}</div>

          {footer && <div className="border-t pt-4 mt-4">{footer}</div>}
        </SheetContent>
      </Sheet>
    </>
  );
}
