// 비밀번호 입력 커스텀 훅

import { useState, useEffect } from 'react';
import { validatePassword } from './passwordUtils';

/**
 * 비밀번호 입력 관리 커스텀 훅
 * @param {Object} options - 설정 옵션
 * @returns {Object} 비밀번호 입력 관련 상태와 함수들
 */
export const usePasswordInput = (options = {}) => {
    const {
        onPasswordChange = () => {},
        onValidationChange = () => {},
        initialPassword = '',
        initialConfirm = ''
    } = options;

    const [password, setPassword] = useState(initialPassword);
    const [passwordConfirm, setPasswordConfirm] = useState(initialConfirm);
    const [validation, setValidation] = useState({
        status: 'default',
        message: ''
    });

    // 비밀번호 변경 핸들러
    const handlePasswordChange = (value) => {
        setPassword(value);
        onPasswordChange(value);
    };

    // 비밀번호 확인 변경 핸들러
    const handlePasswordConfirmChange = (value) => {
        setPasswordConfirm(value);
    };

    // 검증 로직
    useEffect(() => {
        const result = validatePassword(password, passwordConfirm);
        setValidation(result);
        onValidationChange(result);
    }, [password, passwordConfirm, onPasswordChange, onValidationChange]);

    // 폼 리셋 함수
    const resetPassword = () => {
        setPassword('');
        setPasswordConfirm('');
        setValidation({ status: 'default', message: '' });
    };

    // 유효성 상태
    const isValid = validation.status === 'success';
    const hasError = validation.status === 'error';

    return {
        // 상태
        password,
        passwordConfirm,
        validation,
        isValid,
        hasError,

        // 핸들러
        handlePasswordChange,
        handlePasswordConfirmChange,
        resetPassword,

        // 유틸리티
        setPassword,
        setPasswordConfirm
    };
};