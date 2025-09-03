// 비밀번호 검증 전용 유틸리티

/**
 * 비밀번호 강도 검증 함수
 * @param {string} password - 검증할 비밀번호
 * @returns {Object} 검증 결과 { isValid, message, strength }
 */
export const validatePasswordStrength = (password) => {
    if (!password) {
        return { isValid: false, message: '', strength: 'none' };
    }

    // 길이 체크 (8~16자)
    if (password.length < 8) {
        return {
            isValid: false,
            message: '❌ 비밀번호는 8자 이상이어야 합니다',
            strength: 'weak'
        };
    }
    if (password.length > 16) {
        return {
            isValid: false,
            message: '❌ 비밀번호는 16자 이하여야 합니다',
            strength: 'weak'
        };
    }

    // 패턴 체크
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasLetter) {
        return {
            isValid: false,
            message: '❌ 영문자를 포함해야 합니다',
            strength: 'weak'
        };
    }
    if (!hasNumber) {
        return {
            isValid: false,
            message: '❌ 숫자를 포함해야 합니다',
            strength: 'weak'
        };
    }
    if (!hasSpecial) {
        return {
            isValid: false,
            message: '❌ 특수문자를 포함해야 합니다',
            strength: 'weak'
        };
    }

    // 모든 조건 만족
    return {
        isValid: true,
        message: '✅ 사용 가능한 비밀번호입니다',
        strength: 'strong'
    };
};

/**
 * 비밀번호 확인 검증 함수
 * @param {string} password - 원본 비밀번호
 * @param {string} passwordConfirm - 확인 비밀번호
 * @returns {Object} 검증 결과 { isValid, message }
 */
export const validatePasswordMatch = (password, passwordConfirm) => {
    if (!passwordConfirm) {
        return { isValid: false, message: '' };
    }

    if (password !== passwordConfirm) {
        return {
            isValid: false,
            message: '❌ 비밀번호가 일치하지 않습니다'
        };
    }

    // 원본 비밀번호도 유효한지 체크
    const strengthCheck = validatePasswordStrength(password);
    if (!strengthCheck.isValid) {
        return { isValid: false, message: strengthCheck.message };
    }

    return {
        isValid: true,
        message: '✅ 비밀번호가 일치합니다'
    };
};

/**
 * 통합 비밀번호 검증 함수 (기존 validatePassword 대체)
 * @param {string} password - 비밀번호
 * @param {string} passwordConfirm - 비밀번호 확인
 * @returns {Object} 검증 결과 { status, message }
 */
export const validatePassword = (password, passwordConfirm) => {
    // 비밀번호 강도 체크
    const strengthResult = validatePasswordStrength(password);
    if (password && !strengthResult.isValid) {
        return { status: 'error', message: strengthResult.message };
    }

    // 비밀번호 확인 체크
    const matchResult = validatePasswordMatch(password, passwordConfirm);
    if (passwordConfirm && !matchResult.isValid) {
        return { status: 'error', message: matchResult.message };
    }

    // 성공
    if (passwordConfirm && matchResult.isValid) {
        return { status: 'success', message: matchResult.message };
    }

    return { status: 'default', message: '' };
};

/**
 * 비밀번호 입력 필드용 설정
 */
export const PASSWORD_CONFIG = {
    placeholder: '비밀번호 (8~16자, 영문+숫자+특수문자)',
    confirmPlaceholder: '비밀번호를 다시 입력하세요',
    maxLength: 16,
    pattern: {
        length: /^.{8,16}$/,
        letter: /[a-zA-Z]/,
        number: /[0-9]/,
        special: /[!@#$%^&*(),.?":{}|<>]/
    }
};