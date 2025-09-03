"use client";

import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { BasicUsage } from "./sidebarComponents/BasicUsage";
import { CustomStyle } from "./sidebarComponents/CustomStyle";
import { FormInput } from "./sidebarComponents/FormInput";
import { CommerceManagement } from "./sidebarComponents/CommerceManagement";
import { NestedSidebar } from "./sidebarComponents/NestedSidebar";
import BasicSidebarExample from "./sidebarComponents/BasicSidebarExample";
import BackButtonSidebarExample from "./sidebarComponents/BackButtonSidebarExample";
import CloseButtonSidebarExample from "./sidebarComponents/CloseButtonSidebarExample";
import MoreMenuSidebarExample from "./sidebarComponents/MoreMenuSidebarExample";
import ClickableTitleSidebarExample from "./sidebarComponents/ClickableTitleSidebarExample";
import FooterSidebarExample from "./sidebarComponents/FooterSidebarExample";
import ComplexSidebarExample from "./sidebarComponents/ComplexSidebarExample";

// 탭 네비게이션 컴포넌트
function TabNavigation({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
            activeTab === tab.id ? "bg-blue-600 text-white shadow-lg" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <span>{tab.label}</span>
          <Badge variant={activeTab === tab.id ? "secondary" : "outline"} className="text-xs">
            {tab.badge}
          </Badge>
        </button>
      ))}
    </div>
  );
}

// 메인 컴포넌트
export default function SidebarExample() {
  const [activeTab, setActiveTab] = useState("basic");

  const tabs = [
    { id: "examples", label: "사이드바 예시", badge: "새로 추가" },
    { id: "basic", label: "기본 사용법", badge: "필수" },
    { id: "custom", label: "커스텀 스타일", badge: "고급" },
    { id: "forms", label: "폼 입력", badge: "실용" },
    { id: "commerce", label: "상품 관리", badge: "비즈니스" },
    { id: "nested", label: "중첩 사이드바", badge: "고급" },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* 헤더 섹션 */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          사이드바 컴포넌트 가이드
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          다양한 상황에 맞는 사이드바 사용법을 확인하고 실제 프로젝트에 적용해보세요
        </p>
      </div>

      {/* 탭 네비게이션 */}
      <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 탭 내용 */}
      {activeTab === "examples" && (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Sidebar 컴포넌트 다양한 사용 예시</h2>
            <p className="text-gray-600">Sidebar 컴포넌트의 다양한 props와 기능들을 실제 사용 예시로 확인해보세요</p>
          </div>

          <div className="grid gap-8">
            <BasicSidebarExample />
            <BackButtonSidebarExample />
            <CloseButtonSidebarExample />
            <MoreMenuSidebarExample />
            <ClickableTitleSidebarExample />
            <FooterSidebarExample />
            <ComplexSidebarExample />
          </div>
        </div>
      )}
      {activeTab === "basic" && <BasicUsage onBack={true} />}
      {activeTab === "custom" && <CustomStyle />}
      {activeTab === "forms" && <FormInput />}
      {activeTab === "commerce" && <CommerceManagement />}
      {activeTab === "nested" && <NestedSidebar onBack={true} />}
    </div>
  );
}
