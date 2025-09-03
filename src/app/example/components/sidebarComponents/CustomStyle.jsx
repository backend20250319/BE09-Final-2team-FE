import Sidebar from "@/components/common/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// 커스텀 스타일 컴포넌트
export function CustomStyle() {
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
            onClose={true}
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
