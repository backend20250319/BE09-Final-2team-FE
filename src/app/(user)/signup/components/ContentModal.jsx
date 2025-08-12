"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ContentModal({
                                         open,
                                         title,
                                         content,
                                         onClose
                                     }) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-[500px] max-w-[90vw] max-h-[70vh] flex flex-col">
                {/* 헤더 - X버튼 제거, DialogHeader가 자동으로 처리 */}
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-lg font-semibold text-left">{title}</DialogTitle>
                </DialogHeader>

                {/* 스크롤 가능한 내용 */}
                <div className="flex-1 overflow-y-auto py-4 px-1">
                    <div
                        className="text-sm leading-relaxed text-gray-700 whitespace-pre-line"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}