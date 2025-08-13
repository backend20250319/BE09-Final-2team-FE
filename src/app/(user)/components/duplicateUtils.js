// 중복 확인 및 검증 유틸리티

/**
 * 중복 확인 API 호출 (임시)
 * @param {string} type - 확인할 필드 타입 (loginId, email, nickname)
 * @param {string} value - 확인할 값
 * @returns {Promise<Object>} 중복 확인 결과 { available, message }
 */
export const checkDuplicate = async (type, value) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const duplicates = {
                loginId: ['admin', 'test', 'user'],
                email: ['test@test.com', 'admin@admin.com'],
                nickname: ['관리자', '테스트', 'admin']
            };

            const isDuplicate = duplicates[type]?.includes(value);
            resolve({
                available: !isDuplicate,
                message: isDuplicate ? '이미 사용 중입니다' : '사용 가능합니다'
            });
        }, 1000);
    });
};

/**
 * 필드명 매핑 함수
 * @param {string} type - 필드 타입
 * @returns {string} 한글 필드명
 */
export const getFieldName = (type) => {
    const names = {
        loginId: '아이디',
        email: '이메일',
        nickname: '닉네임'
    };
    return names[type] || type;
};

/**
 * 기본 검증 에러 메시지 반환
 * @param {string} type - 필드 타입
 * @returns {string} 에러 메시지
 */
export const getValidationErrorMessage = (type) => {
    const messages = {
        loginId: '❌ 아이디를 입력해주세요',
        email: '❌ 이메일을 입력해주세요',
        nickname: '✅ 아이디가 닉네임이 됩니다'
    };
    return messages[type] || '❌ 입력값을 확인해주세요';
};

/**
 * 검증 상태 설정 헬퍼 함수 팩토리
 * @param {Function} setValidationStates - 상태 설정 함수
 * @returns {Function} 검증 메시지 설정 함수
 */
export const createValidationSetter = (setValidationStates) => {
    return (field, status, message, checked = false) => {
        setValidationStates(prev => ({
            ...prev,
            [field]: { status, message, checked }
        }));
    };
};

/**
 * 중복 확인 핸들러 생성 함수
 * @param {Object} formData - 폼 데이터
 * @param {Function} setValidationMessage - 검증 메시지 설정 함수
 * @param {Object} options - 추가 옵션
 * @returns {Function} 중복 확인 핸들러
 */
export const createDuplicateCheckHandler = (formData, setValidationMessage, options = {}) => {
    const {
        nicknameEmptyMessage = '✅ 아이디가 닉네임이 됩니다',
        nicknameMinLength = 2,
        nicknameMaxLength = 10
    } = options;

    return async (type) => {
        const value = formData[type];

        // 빈 값 체크
        if (!value.trim()) {
            if (type === 'nickname') {
                setValidationMessage(type, 'success', nicknameEmptyMessage, true);
                return;
            }
            setValidationMessage(type, 'error', getValidationErrorMessage(type));
            return;
        }

        // 닉네임 길이 체크
        if (type === 'nickname' && (value.length < nicknameMinLength || value.length > nicknameMaxLength)) {
            return;
        }

        // 로딩 상태
        setValidationMessage(type, 'loading', '🔄 확인 중...');

        try {
            const result = await checkDuplicate(type, value);
            const message = result.available
                ? `✅ 사용 가능한 ${getFieldName(type)}입니다`
                : `❌ ${result.message}`;
            const status = result.available ? 'success' : 'error';
            setValidationMessage(type, status, message, result.available);
        } catch (error) {
            setValidationMessage(type, 'error', '❌ 확인 중 오류가 발생했습니다');
        }
    };
};

/**
 * 닉네임 특별 검증 로직
 * @param {string} value - 닉네임 값
 * @param {Function} setValidationMessage - 검증 메시지 설정 함수
 * @param {Object} options - 설정 옵션
 * @returns {boolean} 계속 진행할지 여부
 */
export const handleNicknameValidation = (value, setValidationMessage, options = {}) => {
    const {
        emptyMessage = '✅ 아이디가 닉네임이 됩니다',
        minLength = 2,
        maxLength = 10
    } = options;

    if (value.trim() === '') {
        setValidationMessage('nickname', 'success', emptyMessage, true);
        return false; // 더 이상 진행하지 않음
    }

    if (value.length < minLength || value.length > maxLength) {
        const message = `❌ 닉네임은 ${value.length < minLength ? `${minLength}글자 이상` : `${maxLength}글자 이하`}이어야 합니다`;
        setValidationMessage('nickname', 'error', message);
        return false; // 더 이상 진행하지 않음
    }

    return true; // 계속 진행
};