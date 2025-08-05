import Sidebar from "@/components/common/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// 폼 입력 컴포넌트
export function FormInput() {
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
            onClose={true}
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
