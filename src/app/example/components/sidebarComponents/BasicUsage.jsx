import Sidebar from "@/components/common/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { Badge } from "lucide-react";

// 기본 사용법 컴포넌트
export function BasicUsage({ onBack, footer }) {
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
  onBack={true}
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
                { prop: "onBack", desc: "뒤로가기 버튼 사용 유무", required: false },
                { prop: "onClose", desc: "닫기 버튼 사용 유무", required: false },
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
              onClose={true}
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
