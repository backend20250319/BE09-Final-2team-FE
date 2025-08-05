"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/common/Sidebar";
import { useState } from "react";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";

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

// 기본 사용법 컴포넌트
function BasicUsage({ onBack, footer }) {
  return (
    <Card className="border-2 border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">📚</span>
          기본 사이드바 사용법
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">코드 예제</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
              {`import Sidebar from "@/components/common/Sidebar";

<Sidebar 
  title="제목" 
  trigger={<Button>열기</Button>}
  children={<div>사이드바 내용</div>}
  onBack={onBack}
  width="max-w-[800px]"
  titleClassName="text-center text-lg font-bold"
  titleStyle={{ color: '#3b82f6' }}
  titleProps={{ 'aria-label': '사이드바 제목' }}
  footer={
    <SheetFooter>
      <SheetClose asChild>
        <Button variant="outline" className="flex-1">
          취소
        </Button>
      </SheetClose>
      <Button type="submit" className="flex-1">
        저장
      </Button>
    </SheetFooter>
  }
>
  {/* 사이드바 내용 */}
</Sidebar>`}
            </pre>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">주요 Props</h3>
            <div className="space-y-3">
              {[
                { prop: "title", desc: "사이드바 제목", required: true },
                { prop: "trigger", desc: "사이드바를 여는 트리거 요소", required: true },
                { prop: "children", desc: "사이드바 내부 내용", required: true },
                { prop: "onBack", desc: "뒤로가기 버튼 클릭 시 실행할 함수", required: false },
                { prop: "width", desc: "사이드바 너비 (기본: max-w-[600px])", required: false },
                { prop: "titleClassName", desc: "제목의 CSS 클래스", required: false },
                { prop: "titleStyle", desc: "제목의 인라인 스타일", required: false },
                { prop: "titleProps", desc: "제목에 전달할 추가 props", required: false },
                { prop: "footer", desc: "하단 액션 버튼 영역", required: false },
              ].map((item) => (
                <div key={item.prop} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <code className="text-blue-600 font-mono">{item.prop}</code>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                  {item.required && (
                    <Badge variant="destructive" className="text-xs">
                      필수
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">실제 예제</h3>

          {/* 기본 사이드바 */}
          <div className="mb-6">
            <h4 className="text-md font-semibold mb-3 text-gray-700">1. 기본 사이드바</h4>
            <Sidebar
              title="기본 사이드바"
              titleClassName="text-center text-lg"
              trigger={<Button variant="default">기본 사이드바 열기</Button>}
              onBack={onBack}
              footer={
                <SheetFooter>
                  <SheetClose asChild>
                    <Button variant="outline" className="flex-1">
                      취소
                    </Button>
                  </SheetClose>
                  <Button type="submit" className="flex-1">
                    저장
                  </Button>
                </SheetFooter>
              }
            >
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-blue-800">✨ 주요 특징</h4>
                  <ul className="text-sm space-y-2 text-blue-700">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      제목 왼쪽에 뒤로가기 아이콘 표시
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      오른쪽에서 슬라이드 인 애니메이션
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      반응형 디자인 지원
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      ESC 키로 닫기 가능
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      스크롤 가능한 내용 영역
                    </li>
                  </ul>
                </div>
                <p className="text-gray-600">
                  이 사이드바는 가장 기본적인 형태로, 뒤로가기 아이콘이 포함되어 있습니다. 트리거 버튼을 클릭하면
                  오른쪽에서 나타나며, 뒤로가기 아이콘을 클릭하면 지정된 함수가 실행됩니다.
                </p>
              </div>
            </Sidebar>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 커스텀 스타일 컴포넌트
function CustomStyle() {
  return (
    <Card className="border-2 border-purple-100">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🎨</span>
          커스텀 스타일 사이드바
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">스타일 커스터마이징</h3>
            <p className="text-gray-600 mb-4">
              titleClassName prop을 사용하여 제목의 스타일을 커스터마이징할 수 있습니다.
            </p>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
              {`<Sidebar
  title="커스텀 제목"
  titleClassName="text-2xl font-bold text-purple-600"
  trigger={<Button>열기</Button>}
>`}
            </pre>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">사용 가능한 클래스</h3>
            <div className="space-y-2">
              {[
                "text-2xl: 큰 폰트 크기",
                "font-bold: 굵은 폰트",
                "text-purple-600: 보라색 텍스트",
                "underline: 밑줄",
                "italic: 기울임체",
              ].map((cls) => (
                <div key={cls} className="p-2 bg-gray-50 rounded text-sm">
                  <code className="text-purple-600">{cls}</code>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <Sidebar
            title="커스텀 스타일 사이드바"
            trigger={
              <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                커스텀 스타일 열기
              </Button>
            }
            titleClassName="text-2xl font-bold text-purple-600 underline"
          >
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-purple-800">🎨 커스텀 스타일 적용</h4>
                <ul className="text-sm space-y-2 text-purple-700">
                  <li>• 제목에 큰 폰트와 보라색 적용</li>
                  <li>• 밑줄 효과 추가</li>
                  <li>• 트리거 버튼도 보라색 테마 적용</li>
                </ul>
              </div>
              <p className="text-gray-600">
                이 예제는 titleClassName prop을 사용하여 제목의 스타일을 커스터마이징한 것입니다. Tailwind CSS 클래스를
                조합하여 원하는 스타일을 만들 수 있습니다.
              </p>
            </div>
          </Sidebar>
        </div>
      </CardContent>
    </Card>
  );
}

// 폼 입력 컴포넌트
function FormInput() {
  return (
    <Card className="border-2 border-green-100">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">📝</span>폼 입력 사이드바
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Footer 활용</h3>
            <p className="text-gray-600 mb-4">footer prop을 사용하여 하단에 액션 버튼을 추가할 수 있습니다.</p>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
              {`<Sidebar
  title="폼 입력"
  footer={
    <div className="flex gap-2">
      <Button variant="outline">취소</Button>
      <Button>저장</Button>
    </div>
  }
>`}
            </pre>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">사용 사례</h3>
            <div className="space-y-2">
              {["사용자 정보 수정", "상품 정보 입력", "설정 변경", "데이터 필터링"].map((useCase) => (
                <div key={useCase} className="p-2 bg-green-50 rounded text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {useCase}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <Sidebar
            title="사용자 정보 수정"
            trigger={
              <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                폼 입력 열기
              </Button>
            }
          >
            <div className="space-y-4">
              <p className="text-gray-600">사용자 정보를 수정하고 하단 버튼으로 저장할 수 있습니다.</p>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">이름</label>
                  <input
                    type="text"
                    placeholder="이름을 입력하세요"
                    className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">이메일</label>
                  <input
                    type="email"
                    placeholder="이메일을 입력하세요"
                    className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">전화번호</label>
                  <input
                    type="tel"
                    placeholder="전화번호를 입력하세요"
                    className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">메모</label>
                  <textarea
                    placeholder="추가 메모를 입력하세요"
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </Sidebar>
        </div>
      </CardContent>
    </Card>
  );
}

// 상품 관리 컴포넌트
function CommerceManagement() {
  return (
    <Card className="border-2 border-orange-100">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🛍️</span>
          상품 관리 사이드바
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">비즈니스 활용</h3>
            <p className="text-gray-600 mb-4">
              상품 관리, 주문 처리, 고객 서비스 등 비즈니스 시나리오에 최적화된 사이드바입니다.
            </p>
            <div className="space-y-2">
              {["상품 정보 입력 및 수정", "주문 상태 관리", "고객 문의 처리", "재고 관리"].map((feature) => (
                <div key={feature} className="p-2 bg-orange-50 rounded text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  {feature}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">고급 기능</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
              {`<Sidebar
  title="상품 추가"
  footer={
    <div className="flex gap-2">
      <Button variant="outline">임시저장</Button>
      <Button>상품 등록</Button>
    </div>
  }
>`}
            </pre>
          </div>
        </div>

        <div className="border-t pt-6">
          <Sidebar
            title="상품 정보 관리"
            trigger={
              <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                상품 관리 열기
              </Button>
            }
          >
            <div className="space-y-4">
              <p className="text-gray-600">상품 정보를 입력하고 관리할 수 있습니다.</p>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">상품명 *</label>
                  <input
                    type="text"
                    placeholder="상품명을 입력하세요"
                    className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">가격 *</label>
                    <input
                      type="number"
                      placeholder="가격을 입력하세요"
                      className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">재고 *</label>
                    <input
                      type="number"
                      placeholder="재고 수량"
                      className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">카테고리</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option>전자제품</option>
                    <option>의류</option>
                    <option>도서</option>
                    <option>식품</option>
                    <option>스포츠</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">상품 설명</label>
                  <textarea
                    placeholder="상품에 대한 상세한 설명을 입력하세요"
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">상품 이미지</label>
                  <div className="mt-1 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                    <p className="text-gray-500">이미지를 드래그하거나 클릭하여 업로드하세요</p>
                  </div>
                </div>
              </div>
            </div>
          </Sidebar>
        </div>
      </CardContent>
    </Card>
  );
}

// 중첩 사이드바 컴포넌트
function NestedSidebar({ onBack }) {
  return (
    <Card className="border-2 border-indigo-100">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🔄</span>
          중첩 사이드바 예제
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">중첩 사이드바 개념</h3>
            <p className="text-gray-600">
              사이드바 안에 또 다른 사이드바를 배치하여 계층적인 UI를 구성할 수 있습니다. 이는 복잡한 설정이나 단계별
              작업에 유용합니다.
            </p>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-indigo-800">🎯 사용 사례</h4>
              <ul className="text-sm space-y-2 text-indigo-700">
                <li>• 단계별 설정 마법사</li>
                <li>• 복잡한 폼 입력</li>
                <li>• 상세 정보 표시</li>
                <li>• 설정의 설정</li>
              </ul>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">구현 방법</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
              {`// 1. 메인 사이드바 정의
<Sidebar 
  title="메인 사이드바 제목"
  trigger={<Button>메인 사이드바 열기</Button>}
  footer={
    <div className="flex gap-2">
      <Button variant="outline">취소</Button>
      <Button>저장</Button>
    </div>
  }
  onBack={onBack}
>
  <div className="space-y-4">
    {/* 메인 사이드바 내용 */}
    <div className="bg-blue-50 p-4 rounded-lg">
      <h4>메인 내용</h4>
      <p>기본 설정을 구성합니다.</p>
    </div>
    
    {/* 폼 입력 */}
    <div>
      <label>이름</label>
      <input type="text" placeholder="이름을 입력하세요" />
    </div>
    
    {/* 2. 서브 사이드바 - 메인 사이드바 안에 배치 */}
    <Sidebar 
      title="서브 사이드바 제목"
      trigger={
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full border-blue-200 text-blue-700"
        >
          🔧 상세 설정 열기
        </Button>
      }
      footer={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">닫기</Button>
          <Button size="sm">적용</Button>
        </div>
      }
      onBack={onBack}
    >
      <div className="space-y-4">
        {/* 서브 사이드바 내용 */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h4>상세 설정</h4>
          <p>추가 옵션을 구성합니다.</p>
        </div>
        
        {/* 서브 사이드바 폼 */}
        <div>
          <label>설정 옵션</label>
          <select>
            <option>옵션 1</option>
            <option>옵션 2</option>
          </select>
        </div>
      </div>
    </Sidebar>
  </div>
</Sidebar>`}
            </pre>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">실제 예제</h3>

          {/* 메인 사이드바 */}
          <Sidebar
            title="프로젝트 설정"
            trigger={
              <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                중첩 사이드바 열기
              </Button>
            }
            onBack={onBack}
          >
            <div className="space-y-4">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-indigo-800">📋 프로젝트 기본 정보</h4>
                <p className="text-sm text-indigo-700 mb-4">
                  프로젝트의 기본 설정을 구성하고, 필요시 상세 설정을 위해 서브 사이드바를 사용할 수 있습니다.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">프로젝트명</label>
                  <input
                    type="text"
                    placeholder="프로젝트명을 입력하세요"
                    className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">설명</label>
                  <textarea
                    placeholder="프로젝트에 대한 설명을 입력하세요"
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h5 className="font-semibold mb-3 text-gray-800">고급 설정</h5>
                <p className="text-sm text-gray-600 mb-4">
                  더 상세한 설정이 필요하시면 아래 버튼을 클릭하여 서브 사이드바를 열어보세요.
                </p>

                {/* 서브 사이드바 */}
                <Sidebar
                  title="고급 설정"
                  trigger={
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      🔧 고급 설정 열기
                    </Button>
                  }
                  onBack={onBack}
                >
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 text-blue-800">⚙️ 고급 설정 옵션</h4>
                      <p className="text-sm text-blue-700">프로젝트의 세부적인 설정을 구성할 수 있습니다.</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">빌드 설정</label>
                        <select className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>Production</option>
                          <option>Development</option>
                          <option>Staging</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">캐시 설정</label>
                        <div className="space-y-2 mt-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">캐시 사용</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">압축 사용</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">배포 설정</label>
                        <div className="space-y-2 mt-2">
                          <label className="flex items-center">
                            <input type="radio" name="deploy" className="mr-2" />
                            <span className="text-sm">자동 배포</span>
                          </label>
                          <label className="flex items-center">
                            <input type="radio" name="deploy" className="mr-2" />
                            <span className="text-sm">수동 배포</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">알림 설정</label>
                        <textarea
                          placeholder="알림 설정에 대한 추가 정보를 입력하세요"
                          rows={3}
                          className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </Sidebar>
              </div>
            </div>
          </Sidebar>
        </div>
      </CardContent>
    </Card>
  );
}

// 메인 컴포넌트
export default function SidebarExample() {
  const [activeTab, setActiveTab] = useState("basic");

  const tabs = [
    { id: "basic", label: "기본 사용법", badge: "필수" },
    { id: "custom", label: "커스텀 스타일", badge: "고급" },
    { id: "forms", label: "폼 입력", badge: "실용" },
    { id: "commerce", label: "상품 관리", badge: "비즈니스" },
    { id: "nested", label: "중첩 사이드바", badge: "고급" },
  ];

  // onBack 함수 정의 - 실제 뒤로가기 기능
  const onBack = () => {
    console.log("뒤로가기 버튼이 클릭되었습니다!");
  };

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
      {activeTab === "basic" && <BasicUsage onBack={onBack} />}
      {activeTab === "custom" && <CustomStyle />}
      {activeTab === "forms" && <FormInput />}
      {activeTab === "commerce" && <CommerceManagement />}
      {activeTab === "nested" && <NestedSidebar onBack={onBack} />}
    </div>
  );
}
