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