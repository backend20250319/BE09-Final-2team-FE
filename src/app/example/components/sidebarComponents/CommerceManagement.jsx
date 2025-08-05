import Sidebar from "@/components/common/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// 상품 관리 컴포넌트
export function CommerceManagement() {
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
            onClose={true}
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
