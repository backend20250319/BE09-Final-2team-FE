// 요청용 (백엔드 전달 값)
export const AgeGroup = Object.freeze({
    MONTH_0_6: 'MONTH_0_6',
    MONTH_6_12: 'MONTH_6_12',
    YEAR_1_2: 'YEAR_1_2',
    YEAR_2_4: 'YEAR_2_4',
    YEAR_4_6: 'YEAR_4_6',
    YEAR_6_8: 'YEAR_6_8',
    OVER_8: 'OVER_8',
});

// 화면에 노출 텍스트
export const AgeGroupText = Object.freeze({
    [AgeGroup.MONTH_0_6]: '0~6개월',
    [AgeGroup.MONTH_6_12]: '6~12개월',
    [AgeGroup.YEAR_1_2]: '1~2세',
    [AgeGroup.YEAR_2_4]: '2~4세',
    [AgeGroup.YEAR_4_6]: '4~6세',
    [AgeGroup.YEAR_6_8]: '6~8세',
    [AgeGroup.OVER_8]: '8세 이상',
});

// 변환 함수
export const getAgeGroupText = (group) => AgeGroupText[group];
