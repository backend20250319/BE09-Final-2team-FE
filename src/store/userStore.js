import { create } from 'zustand';

// 사용자 상태 관리 스토어
export const useUserStore = create((set, get) => ({
    // 사용자 정보 상태
    userInfo: {
        // 기본 정보
        name: '',
        nickname: '',
        email: '',
        phone: '',
        address: '',

        // 회원가입 관련
        loginId: '',
        password: '', // 임시 저장용 (실제로는 백엔드로만 전송)

        // 카카오 관련
        kakaoId: '',
        kakaoNickname: '',
        kakaoEmail: '',

        // 약관 동의
        agreements: {
            terms: false,
            privacy: false,
            age: false,
            location: false,
            push: false
        },

        // 메타 정보
        signupType: 'normal', // 'normal' | 'kakao'
        isLoggedIn: false,

        // 회원가입 진행 상태
        signupStep: 0, // 0: 미시작, 1: 기본정보입력, 2: 추가정보입력, 3: 완료
    },

    // 액션들

    // 사용자 정보 전체 업데이트
    updateUserInfo: (newInfo) => set((state) => ({
        userInfo: {
            ...state.userInfo,
            ...newInfo
        }
    })),

    // 특정 필드만 업데이트
    updateField: (field, value) => set((state) => ({
        userInfo: {
            ...state.userInfo,
            [field]: value
        }
    })),

    // 약관 동의 업데이트
    updateAgreements: (agreements) => set((state) => ({
        userInfo: {
            ...state.userInfo,
            agreements: {
                ...state.userInfo.agreements,
                ...agreements
            }
        }
    })),

    // 회원가입 단계 업데이트
    setSignupStep: (step) => set((state) => ({
        userInfo: {
            ...state.userInfo,
            signupStep: step
        }
    })),

    // 로그인 상태 설정
    setLoginStatus: (isLoggedIn) => set((state) => ({
        userInfo: {
            ...state.userInfo,
            isLoggedIn
        }
    })),

    // 카카오 정보 설정
    setKakaoInfo: (kakaoData) => set((state) => ({
        userInfo: {
            ...state.userInfo,
            kakaoId: kakaoData.id,
            kakaoNickname: kakaoData.nickname,
            kakaoEmail: kakaoData.email,
            signupType: 'kakao'
        }
    })),

    // 사용자 정보 초기화 (로그아웃 시)
    clearUserInfo: () => set({
        userInfo: {
            name: '',
            nickname: '',
            email: '',
            phone: '',
            address: '',
            loginId: '',
            password: '',
            kakaoId: '',
            kakaoNickname: '',
            kakaoEmail: '',
            agreements: {
                terms: false,
                privacy: false,
                age: false,
                location: false,
                push: false
            },
            signupType: 'normal',
            isLoggedIn: false,
            signupStep: 0
        }
    }),

    // 🆕 회원가입 처리 (로컬스토리지에 저장)
    processSignup: (userData) => {
        try {
            // 기존 회원 목록 가져오기
            const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

            // 새 사용자 추가
            const newUser = {
                ...userData,
                registeredAt: new Date().toISOString(),
                id: Date.now().toString() // 임시 ID
            };

            existingUsers.push(newUser);
            localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

            return { success: true, message: '회원가입이 완료되었습니다!' };
        } catch (error) {
            return { success: false, message: '회원가입 중 오류가 발생했습니다.' };
        }
    },

    // 🆕 임시 로그인 처리
    tempLogin: async (loginId, password) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    // 로컬스토리지에서 회원 정보 확인
                    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

                    const user = registeredUsers.find(u =>
                        u.loginId === loginId && u.password === password
                    );

                    if (user) {
                        // 로그인 성공
                        set((state) => ({
                            userInfo: {
                                ...state.userInfo,
                                name: user.name,
                                nickname: user.nickname,
                                email: user.email,
                                phone: user.phone,
                                address: user.address,
                                loginId: user.loginId,
                                agreements: user.agreements,
                                signupType: user.signupType || 'normal',
                                isLoggedIn: true,
                                password: '' // 보안상 비밀번호는 저장하지 않음
                            }
                        }));

                        resolve({
                            success: true,
                            message: '로그인되었습니다!',
                            user: { ...user, password: undefined } // 비밀번호 제외하고 반환
                        });
                    } else {
                        resolve({
                            success: false,
                            message: '아이디 또는 비밀번호가 잘못되었습니다.'
                        });
                    }
                } catch (error) {
                    resolve({
                        success: false,
                        message: '로그인 중 오류가 발생했습니다.'
                    });
                }
            }, 1000); // 1초 로딩 시뮬레이션
        });
    },

    // 🆕 카카오 임시 로그인 처리
    tempKakaoLogin: async (kakaoData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    // 카카오 ID로 기존 회원 확인
                    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                    const existingUser = registeredUsers.find(u => u.kakaoId === kakaoData.id);

                    if (existingUser) {
                        // 기존 카카오 회원 로그인
                        set((state) => ({
                            userInfo: {
                                ...state.userInfo,
                                ...existingUser,
                                isLoggedIn: true,
                                password: ''
                            }
                        }));

                        resolve({
                            success: true,
                            isNewUser: false,
                            message: '카카오 로그인되었습니다!',
                            user: existingUser
                        });
                    } else {
                        // 신규 카카오 사용자 - 추가정보 입력 필요
                        set((state) => ({
                            userInfo: {
                                ...state.userInfo,
                                kakaoId: kakaoData.id,
                                kakaoNickname: kakaoData.nickname,
                                kakaoEmail: kakaoData.email,
                                signupType: 'kakao',
                                isLoggedIn: false // 추가정보 입력 전까지는 로그인 상태 아님
                            }
                        }));

                        resolve({
                            success: true,
                            isNewUser: true,
                            message: '추가정보를 입력해주세요.',
                            kakaoData
                        });
                    }
                } catch (error) {
                    resolve({
                        success: false,
                        message: '카카오 로그인 중 오류가 발생했습니다.'
                    });
                }
            }, 1000);
        });
    },

    // 🆕 로그아웃 처리
    logout: () => {
        set({
            userInfo: {
                name: '',
                nickname: '',
                email: '',
                phone: '',
                address: '',
                loginId: '',
                password: '',
                kakaoId: '',
                kakaoNickname: '',
                kakaoEmail: '',
                agreements: {
                    terms: false,
                    privacy: false,
                    age: false,
                    location: false,
                    push: false
                },
                signupType: 'normal',
                isLoggedIn: false,
                signupStep: 0
            }
        });

        return { success: true, message: '로그아웃되었습니다.' };
    },

    // 🆕 로그인 상태 확인
    checkAuthStatus: () => {
        const { userInfo } = get();
        return userInfo.isLoggedIn;
    },

    // Computed 값들 (getter 함수들)

    // 폼 유효성 검사 (일반 회원가입) - 닉네임 선택사항
    isSignupFormValid: () => {
        const { userInfo } = get();
        const requiredFields = ['name', 'loginId', 'password', 'email', 'phone', 'address'];
        const requiredAgreements = ['terms', 'privacy', 'age'];

        const isFieldsValid = requiredFields.every(field =>
            userInfo[field] && userInfo[field].trim() !== ''
        );
        const isAgreementsValid = requiredAgreements.every(field =>
            userInfo.agreements[field]
        );

        // 일반 회원가입에서는 닉네임 선택사항
        const isNicknameValid = true; // 닉네임은 항상 유효 (선택사항)

        return isFieldsValid && isAgreementsValid && isNicknameValid;
    },

    // 추가정보 입력 폼 유효성 검사 (카카오) - 닉네임 필수
    isAdditionalInfoValid: () => {
        const { userInfo } = get();
        const requiredFields = ['name', 'nickname', 'address'];

        const isFieldsValid = requiredFields.every(field =>
            userInfo[field] && userInfo[field].trim() !== ''
        );
        const isAgreementValid = userInfo.agreements.privacy;

        return isFieldsValid && isAgreementValid;
    },

    // 현재 사용자 표시명 가져오기
    getDisplayName: () => {
        const { userInfo } = get();

        // 우선순위: 1. 닉네임, 2. 아이디, 3. 이름, 4. 카카오 닉네임, 5. 기본값
        return userInfo.nickname || userInfo.loginId || userInfo.name || userInfo.kakaoNickname || '사용자';
    }
}));

// 편의 훅들 (선택적 사용)
export const useUserInfo = () => useUserStore((state) => state.userInfo);
export const useUserActions = () => useUserStore((state) => ({
    updateUserInfo: state.updateUserInfo,
    updateField: state.updateField,
    updateAgreements: state.updateAgreements,
    setSignupStep: state.setSignupStep,
    setLoginStatus: state.setLoginStatus,
    setKakaoInfo: state.setKakaoInfo,
    clearUserInfo: state.clearUserInfo,
    processSignup: state.processSignup,
    tempLogin: state.tempLogin,
    tempKakaoLogin: state.tempKakaoLogin,
    logout: state.logout,
    checkAuthStatus: state.checkAuthStatus
}));
export const useUserValidation = () => useUserStore((state) => ({
    isSignupFormValid: state.isSignupFormValid,
    isAdditionalInfoValid: state.isAdditionalInfoValid,
    getDisplayName: state.getDisplayName
}));