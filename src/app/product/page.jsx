'use client';

import ProductCard from '../../components/common/ProductCard';

export default function Page() {
    // TODO: 실제로는 API로 값을 받아와야 함
    const product = {
        productName: '상품명',
        price: '5,000원',
        location: '송림 1동',
        timeAgo: '9시간 전',
        imageUrl:
            'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474',
        trade_status: 'ON_SALE',
        status: 'NEW',
        hasWrittenReview: false,
        showReviewButton: false,
    };

    // size 설명:
    // size1: 메인페이지 상품 카드
    // size2: 내 구매/판매 상품 카드
    // size3: 유저 프로필 판매상품 or 검색 결과 상품 카드
    return <ProductCard product={product} size='size3' />;
}
