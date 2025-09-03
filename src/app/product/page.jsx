'use client';
import ProductCard from '@/components/common/ProductCard';
import WishlistSidebar from '@/components/common/WishlistSidebar';
import { Button } from '@/components/ui/button';
import AddressSearch from './components/AddressSearch';
import Link from 'next/link';

export default function Page() {
    // TODO: 실제로는 API로 값을 받아와야 함
    const product = {
        productName:
            '상품명zzzz상품명zzzz상품명zzzz상품명zzzz상품명zzzz상품명zzzz상품명zzzz상품명zzzz상품명zzzz상품명zzzz상품명zzzz',
        price: '5,000원',
        location: '송림 1동',
        timeAgo: '9시간 전',
        imageUrl:
            'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474',
        trade_status: 'SOLD', // ON_SALE(판매중), RESERVED(예약중), ON_HOLD(판매보류), SOLD(판매완료)
        status: 'USED', // NEW(새상품), USED(중고)
        hasWrittenReview: false,
        showReviewButton: true,
    };

    // size 설명:
    // size1: 메인페이지 상품 카드
    // size2: 내 구매/판매 상품 카드
    // size3: 유저 프로필 판매상품 or 검색 결과 상품 카드

    return (
        <div>
            <div>여백</div>

            {/* 주소 검색 컴포넌트 예시 */}
            <AddressSearch />
            {/* 찜한 상품 열기 - trigger안에 디자인된 버튼이나 링크 요소를 넣어서 클릭하면 찜한 상품 페이지가 열림 */}
            <WishlistSidebar trigger={<Button>찜한 상품</Button>} />

            {/* 상품 카드 - product 예시는 위에 있음 */}
            <ProductCard product={product} size='size1' />
            <ProductCard product={product} size='size0' />

            {/* Product Detail Page Link */}
            <div style={{ marginTop: '20px', padding: '20px' }}>
                <Link href='/product/detail'>
                    <Button>상품 상세 페이지 보기</Button>
                </Link>
            </div>
        </div>
    );
}
