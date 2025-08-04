"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import UtilsExample from "./components/UtilsExample";
import ApiExample from "./components/ApiExample";
import ModalExample from "./components/ModalExample";
import CKEditorExample from "./components/CKEditorExample";
import SidebarExample from "./components/SidebarExample";

export default function Page() {
  return (
    <div className="p-6 font-sans leading-relaxed max-w-7xl w-[850px] mx-auto">
      <h1 className="text-3xl font-bold mb-6">공통 함수, 모달, API, CKEditor, 사이드바 예제</h1>

      <Tabs defaultValue="utils" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="utils">📝 공통 함수</TabsTrigger>
          <TabsTrigger value="api">🌐 API</TabsTrigger>
          <TabsTrigger value="modal">🔘 모달</TabsTrigger>
          <TabsTrigger value="ckeditor">📝 CKEditor</TabsTrigger>
          <TabsTrigger value="sidebar">📋 사이드바</TabsTrigger>
        </TabsList>

        {/* 공통 함수 예제 */}
        <TabsContent value="utils" className="mt-6">
          <UtilsExample />
        </TabsContent>

        {/* API 예제 */}
        <TabsContent value="api" className="mt-6">
          <ApiExample />
        </TabsContent>

        {/* 모달 예제 */}
        <TabsContent value="modal" className="mt-6">
          <ModalExample />
        </TabsContent>

        {/* CKEditor 예제 */}
        <TabsContent value="ckeditor" className="mt-6">
          <CKEditorExample />
        </TabsContent>

        {/* 사이드바 예제 */}
        <TabsContent value="sidebar" className="mt-6">
          <SidebarExample />
        </TabsContent>
      </Tabs>
    </div>
  );
}
