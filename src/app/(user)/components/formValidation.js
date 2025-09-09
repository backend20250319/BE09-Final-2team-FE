export const validateEmail = (email) => {
    if (!email.trim()) {
        return { isValid: false, message: '이메일을 입력해주세요' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, message: '올바른 이메일 형식을 입력해주세요' };
    }

    return { isValid: true, message: '' };
};

export const validateName = (name) => {
    if (!name.trim()) {
        return { isValid: false, message: '이름을 입력해주세요' };
    }

    if (name.length < 2) {
        return { isValid: false, message: '이름은 2글자 이상 입력해주세요' };
    }

    return { isValid: true, message: '' };
};

export const validateLoginId = (loginId) => {
    if (!loginId.trim()) {
        return { isValid: false, message: '아이디를 입력해주세요' };
    }

    if (loginId.length < 4) {
        return { isValid: false, message: '아이디는 4글자 이상 입력해주세요' };
    }

    return { isValid: true, message: '' };
};

export const validatePhone = (phone) => {
    if (!phone.trim()) {
        return { isValid: false, message: '휴대폰번호를 입력해주세요' };
    }

    // 숫자만 추출
    const numbers = phone.replace(/\D/g, '');

    if (numbers.length < 10) {
        return { isValid: false, message: '휴대폰번호가 너무 짧습니다' };
    }

    if (numbers.length > 11) {
        return { isValid: false, message: '휴대폰번호가 너무 깁니다' };
    }

    // 백엔드 패턴과 일치: ^01[0-9]{8,9}$
    if (!numbers.startsWith('01')) {
        return { isValid: false, message: '01로 시작하는 번호를 입력해주세요' };
    }

    return { isValid: true, message: '' };
};