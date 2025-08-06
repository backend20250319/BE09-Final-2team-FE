import Sidebar from "@/components/common/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// 중첩 사이드바 컴포넌트
export function NestedSidebar({ onBack }) {
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
            onClose={true}
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
