// 회원가입/추가정보 입력 전용 주소 처리 유틸리티

/**
 * 다음 우편번호 API 데이터를 처리하여 최종 주소 반환
 * @param {Object} data - 다음 우편번호 API에서 받은 데이터
 * @param {boolean} useRoadAddress - 도로명 주소 사용 여부 (기본: true)
 * @returns {string} 처리된 주소 문자열
 */
export const processAddressData = (data, useRoadAddress = true) => {
    if (useRoadAddress && data.roadAddress) {
        // 도로명 주소 사용
        return data.roadAddress;
    }

    // (지번 주소 + 참고항목)
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
        if (data.bname !== '') {
            extraAddress += data.bname;
        }
        if (data.buildingName !== '') {
            extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
        }
        fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
    }

    return fullAddress;
};