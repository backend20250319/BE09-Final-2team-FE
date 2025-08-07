"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export default function Sidebar({ title, trigger, children, width = "max-w-[600px]", titleClassName = "text-center", footer, open, onClose }) {
    return (
        <Sheet open={open} onOpenChange={onClose}>
            <div onClick={() => onClose(true)}>{trigger}</div>

            <SheetContent side="right" className={`${width} px-5 pb-5 flex flex-col`}>
                <SheetHeader className="mb-4 w-full">
                    <SheetTitle className={titleClassName}>{title}</SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto pr-2">{children}</div>

                {footer && <div className="border-t pt-4 mt-4">{footer}</div>}
            </SheetContent>
        </Sheet>
    );
}