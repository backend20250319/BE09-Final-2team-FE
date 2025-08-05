"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";

export default function Sidebar({
  title,
  trigger,
  children,
  width = "max-w-[600px]",
  titleClassName = "",
  titleStyle = {}, // 인라인 스타일을 위한 옵션
  titleProps = {}, // 추가 props를 위한 옵션
  footer,
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>{trigger}</div>

      <SheetContent side="right" className={`${width} px-5 pb-5 flex flex-col`}>
        <SheetHeader className="mb-4 pt-4">
          <SheetTitle className={titleClassName} style={titleStyle} {...titleProps}>
            {title}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto pr-2">{children}</div>

        {footer && <div className="border-t pt-4 mt-4">{footer}</div>}
      </SheetContent>
    </Sheet>
  );
}
