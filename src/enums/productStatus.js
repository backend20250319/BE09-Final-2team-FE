// 요청용
export const ProductStatus = Object.freeze({
    NEW: 'NEW',
    USED: 'USED',
});

// 화면에 노출 텍스트
export const ProductStatusText = Object.freeze({
    [ProductStatus.NEW]: '새상품',
    [ProductStatus.USED]: '중고',
});

// 변환 함수
export const getProductStatusText = (status) => ProductStatusText[status];
