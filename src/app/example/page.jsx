"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import UtilsExample from "./components/UtilsExample";
import ApiExample from "./components/ApiExample";
import ModalExample from "./components/ModalExample";

export default function Page() {
  return (
    <div className="p-6 font-sans leading-relaxed max-w-7xl w-[850px] mx-auto">
      <h1 className="text-3xl font-bold mb-6">공통 함수, 모달, API 예제</h1>

      <Tabs defaultValue="utils" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="utils">📝 공통 함수</TabsTrigger>
          <TabsTrigger value="api">🌐 API</TabsTrigger>
          <TabsTrigger value="modal">🔘 모달</TabsTrigger>
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
      </Tabs>
    </div>
  );
}
