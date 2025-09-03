/* 
  2025-08-27
  상품 정보 조회 컴포넌트
  
  상품 데이터 구조:
  - chat.productName: 상품명
  - chat.productImg: 상품 이미지 URL
  - chat.productPrice: 상품 가격 (숫자)
  - chat.productId: 상품 ID (페이지 이동용)
  - chat.sellerId: 판매자 ID (판매자 여부 판단용)
*/

import { Button } from "@/components/ui/button";
import { numberWithCommas } from "@/utils/format";
import Image from "next/image";

export default function ChatProductInfo({ chat, isSale, onCompleteSale, onGoToReview, isSeller }) {
  return (
    <div className="flex py-4">
      <div onClick={onGoToReview} className="flex items-center gap-4 w-full h-[40px] mb-3 cursor-pointer">
        {chat.productThumbnailUrl ? (
          <Image
            src={chat.productThumbnailUrl}
            alt="product"
            width={40}
            height={40}
            className="rounded w-10 h-10 object-cover"
            onError={(e) => {
              console.warn("이미지 로드 실패", e?.nativeEvent || e);
            }}
          />
        ) : (
          <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-500">
            없음
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex flex-col items-start text-sm">
            <span className="font-medium text-base text-gray-900 truncate">{chat.productName || "테스트 상품"}</span>
            <span className="text-xs text-gray-500">
              {chat.productPrice ? `${numberWithCommas(chat.productPrice)}원` : "가격 정보 없음"}
            </span>
          </div>
        </div>
      </div>

      {/* 판매자인 경우에만 판매완료 버튼 표시 */}
      {isSeller && (
        <Button className="cursor-pointer" onClick={onCompleteSale} disabled={isSale}>
          {isSale ? "판매완료됨" : "판매완료"}
        </Button>
      )}
    </div>
  );
}
