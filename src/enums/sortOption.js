// 요청용 (백엔드 전달 값)
export const SortOption = Object.freeze({
    RECOMMENDED: 'RECOMMENDED', // 추천순
    LATEST: 'LATEST', // 최신순
    PRICE_ASC: 'PRICE_ASC', // 낮은가격순
    PRICE_DESC: 'PRICE_DESC', // 높은가격순
});

// 화면에 노출 텍스트
export const SortOptionText = Object.freeze({
    [SortOption.RECOMMENDED]: '추천순',
    [SortOption.LATEST]: '최신순',
    [SortOption.PRICE_ASC]: '낮은가격순',
    [SortOption.PRICE_DESC]: '높은가격순',
});

// 변환 함수
export const getSortOptionText = (option) => SortOptionText[option];
