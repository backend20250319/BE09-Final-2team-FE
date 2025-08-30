// 요청용
export const TradeStatus = Object.freeze({
    ON_SALE: 'ON_SALE',
    RESERVED: 'RESERVED',
    ON_HOLD: 'ON_HOLD',
    SOLD: 'SOLD',
});

// 화면에 노출 텍스트
export const TradeStatusText = Object.freeze({
    [TradeStatus.ON_SALE]: '판매중',
    [TradeStatus.RESERVED]: '예약중',
    [TradeStatus.ON_HOLD]: '판매보류',
    [TradeStatus.SOLD]: '판매완료',
});

// 변환 함수
export const getTradeStatusText = (status) => TradeStatusText[status];
