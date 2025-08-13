// 핸드폰 번호 처리 유틸리티

/**
 * 핸드폰 번호 자동 포맷팅 함수
 * @param {string} value - 입력된 핸드폰 번호
 * @returns {string} 포맷팅된 핸드폰 번호 (010-1234-5678)
 */
export const formatPhoneNumber = (value) => {
    // 숫자만 추출
    const numbers = value.replace(/\D/g, '');

    // 11자리 초과하면 자르기
    if (numbers.length > 11) return value.slice(0, 13);

    // 길이에 따른 포맷팅
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
};

/**
 * 핸드폰 번호 유효성 검사
 * @param {string} phoneNumber - 검사할 핸드폰 번호
 * @returns {Object} 검증 결과 { isValid, message }
 */
export const validatePhoneNumber = (phoneNumber) => {
    // 숫자만 추출
    const numbers = phoneNumber.replace(/\D/g, '');

    if (!numbers) {
        return { isValid: false, message: '' };
    }

    if (numbers.length < 10) {
        return { isValid: false, message: '❌ 핸드폰 번호가 너무 짧습니다' };
    }

    if (numbers.length > 11) {
        return { isValid: false, message: '❌ 핸드폰 번호가 너무 깁니다' };
    }

    // 010으로 시작하는지 확인 (현재 한국 핸드폰 번호는 거의 010)
    if (!numbers.startsWith('010')) {
        return { isValid: false, message: '❌ 010으로 시작하는 번호를 입력해주세요' };
    }

    return { isValid: true, message: '✅ 올바른 핸드폰 번호입니다' };
};

/**
 * 핸드폰 번호에서 숫자만 추출
 * @param {string} phoneNumber - 포맷팅된 핸드폰 번호
 * @returns {string} 숫자만 추출된 핸드폰 번호
 */
export const extractPhoneNumbers = (phoneNumber) => {
    return phoneNumber.replace(/\D/g, '');
};

/**
 * 핸드폰 번호 설정값
 */
export const PHONE_CONFIG = {
    placeholder: '휴대전화번호를 입력하세요 (01012345678)',
    maxLength: 13, // 010-1234-5678 포맷 기준
    pattern: /^010-\d{4}-\d{4}$/ // 010-1234-5678 포맷
};