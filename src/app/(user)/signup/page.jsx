"use client";

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import './signup.css';
import ContentModal from '@/app/(user)/signup/components/ContentModal';
import { MODAL_CONTENTS } from '@/app/(user)/signup/constants/modalContents';
import DaumPostcode from 'react-daum-postcode';

export default function Signup() {
    const router = useRouter(); // 라우터 추가

    // 폼 데이터 상태
    const [formData, setFormData] = useState({
        name: '',
        loginId: '',
        password: '',
        passwordConfirm: '',
        nickname: '',
        email: '',
        phone: '',
        address: ''
    });

    // 체크박스 상태
    const [agreements, setAgreements] = useState({
        terms: false,
        privacy: false,
        age: false,
        location: false,
        push: false
    });

    // 모달 상태 추가
    const [modalStates, setModalStates] = useState({
        terms: false,
        privacy: false,
        age: false,
        location: false,
        push: false
    });

    const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

    // 중복 확인 상태
    const [validationStates, setValidationStates] = useState({
        loginId: {status: 'default', message: '💡 중복 확인을 눌러주세요', checked: false},
        email: {status: 'default', message: '💡 중복 확인을 눌러주세요', checked: false},
        nickname: {status: 'default', message: '💡 중복 확인을 눌러주세요', checked: false}
    });

    // 기타 검증 상태
    const [passwordMatch, setPasswordMatch] = useState({status: 'default', message: ''});
    const [isFormValid, setIsFormValid] = useState(false);

    // 모달 열기/닫기 함수
    const openModal = (type) => {
        setModalStates(prev => ({...prev, [type]: true}));
    };

    const closeModal = (type) => {
        setModalStates(prev => ({...prev, [type]: false}));
    };

    // 입력값 변경 핸들러
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // 중복 확인 상태 초기화 (값이 변경되면)
        if (['loginId', 'email', 'nickname'].includes(field)) {
            setValidationStates(prev => ({
                ...prev,
                [field]: {
                    status: 'default',
                    message: '💡 중복 확인을 눌러주세요',
                    checked: false
                }
            }));
        }

        // 비밀번호 확인 검증
        if (field === 'passwordConfirm' || field === 'password') {
            const password = field === 'password' ? value : formData.password;
            const passwordConfirm = field === 'passwordConfirm' ? value : formData.passwordConfirm;

            if (passwordConfirm && password !== passwordConfirm) {
                setPasswordMatch({
                    status: 'error',
                    message: '❌ 비밀번호가 일치하지 않습니다'
                });
            } else if (passwordConfirm && password === passwordConfirm) {
                setPasswordMatch({
                    status: 'success',
                    message: '✅ 비밀번호가 일치합니다'
                });
            } else {
                setPasswordMatch({status: 'default', message: ''});
            }
        }
    };

    // 체크박스 변경 핸들러
    const handleAgreementChange = (field, checked) => {
        setAgreements(prev => ({
            ...prev,
            [field]: checked
        }));
    };

    // 전체 동의 체크박스
    const handleAllAgreements = (checked) => {
        setAgreements({
            terms: checked,
            privacy: checked,
            age: checked,
            location: checked,
            push: checked
        });
    };

    // 중복 확인 API 호출 (임시)
    const checkDuplicate = async (type, value) => {
        // 임시 로직 - 실제로는 API 호출
        return new Promise(resolve => {
            setTimeout(() => {
                // 임시로 특정 값들을 중복으로 처리
                const duplicates = {
                    loginId: ['admin', 'test', 'user'],
                    email: ['test@test.com', 'admin@admin.com'],
                    nickname: ['관리자', '테스트']
                };

                const isDuplicate = duplicates[type]?.includes(value);
                resolve({
                    available: !isDuplicate,
                    message: isDuplicate ? '이미 사용 중입니다' : '사용 가능합니다'
                });
            }, 1000);
        });
    };

    // 중복 확인 핸들러
    const handleDuplicateCheck = async (type) => {
        const value = formData[type];

        if (!value.trim()) {
            setValidationStates(prev => ({
                ...prev,
                [type]: {
                    status: 'error',
                    message: '❌ 입력값을 확인해주세요',
                    checked: false
                }
            }));
            return;
        }

        // 로딩 상태
        setValidationStates(prev => ({
            ...prev,
            [type]: {status: 'loading', message: '🔄 확인 중...', checked: false}
        }));

        try {
            const result = await checkDuplicate(type, value);

            setValidationStates(prev => ({
                ...prev,
                [type]: {
                    status: result.available ? 'success' : 'error',
                    message: result.available
                        ? `✅ 사용 가능한 ${getFieldName(type)}입니다`
                        : `❌ ${result.message}`,
                    checked: result.available
                }
            }));
        } catch (error) {
            setValidationStates(prev => ({
                ...prev,
                [type]: {
                    status: 'error',
                    message: '❌ 확인 중 오류가 발생했습니다',
                    checked: false
                }
            }));
        }
    };

    // 필드명 매핑
    const getFieldName = (type) => {
        const names = {
            loginId: '아이디',
            email: '이메일',
            nickname: '닉네임'
        };
        return names[type] || type;
    };

    // 폼 유효성 검사
    useEffect(() => {
        const requiredFields = ['name', 'loginId', 'password', 'passwordConfirm', 'email', 'phone', 'address'];
        const requiredAgreements = ['terms', 'privacy', 'age'];
        const requiredChecks = ['loginId', 'email', 'nickname'];

        const isFieldsValid = requiredFields.every(field => formData[field].trim());
        const isAgreementsValid = requiredAgreements.every(field => agreements[field]);
        const isChecksValid = requiredChecks.every(field =>
            formData[field] === '' || validationStates[field].checked
        );
        const isPasswordValid = passwordMatch.status === 'success' || passwordMatch.status === 'default';

        setIsFormValid(isFieldsValid && isAgreementsValid && isChecksValid && isPasswordValid && formData.nickname.trim());
    }, [formData, agreements, validationStates, passwordMatch]);

    // 폼 제출 핸들러
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isFormValid) {
            console.log('회원가입 데이터:', {formData, agreements});
            router.push('/signup/complete'); // 완료 페이지로 이동
        }
    };

    // 주소 검색 (다음 API 연동 예정)
    const handleAddressComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';

        // 법정동명이 있을 경우 추가
        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }

        // 주소를 input에 설정
        handleInputChange('address', fullAddress);

        // 우편번호 창 닫기
        setIsPostcodeOpen(false);
    };

    // 주소 검색 버튼 클릭 핸들러
    const handleAddressSearch = () => {
        setIsPostcodeOpen(true);
    };

    return (
        <div className="signup-root">
            <div className="signup-card">
                <div className="signup-image"/>

                <form className="signup-form" onSubmit={handleSubmit}>
                    {/* 이름 */}
                    <div className="signup-row">
                        <input
                            className="signup-input"
                            type="text"
                            placeholder="이름을 입력하세요"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                    </div>

                    {/* 아이디 */}
                    <div className="signup-row">
                        <div className="signup-input-container">
                            <input
                                className={`signup-input ${validationStates.loginId.status}`}
                                type="text"
                                placeholder="아이디를 입력하세요"
                                value={formData.loginId}
                                onChange={(e) => handleInputChange('loginId', e.target.value)}
                            />
                            <button
                                className="signup-check-btn"
                                type="button"
                                onClick={() => handleDuplicateCheck('loginId')}
                                disabled={validationStates.loginId.status === 'loading'}
                            >
                                중복 확인
                            </button>
                        </div>
                    </div>
                    <div className={`validation-message ${validationStates.loginId.status}`}>
                        {validationStates.loginId.message}
                    </div>

                    {/* 비밀번호 */}
                    <div className="signup-row">
                        <input
                            className="signup-input"
                            type="password"
                            placeholder="비밀번호를 입력하세요(8자 이상)"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                        />
                    </div>

                    {/* 비밀번호 확인 */}
                    <div className="signup-row">
                        <input
                            className={`signup-input ${passwordMatch.status}`}
                            type="password"
                            placeholder="비밀번호를 다시 입력하세요"
                            value={formData.passwordConfirm}
                            onChange={(e) => handleInputChange('passwordConfirm', e.target.value)}
                        />
                    </div>
                    {passwordMatch.message && (
                        <div className={`validation-message ${passwordMatch.status}`}>
                            {passwordMatch.message}
                        </div>
                    )}

                    {/* 닉네임 */}
                    <div className="signup-row">
                        <div className="signup-input-container">
                            <input
                                className={`signup-input ${validationStates.nickname.status}`}
                                type="text"
                                placeholder="닉네임을 입력하세요 (선택, 2~10자)"
                                value={formData.nickname}
                                onChange={(e) => handleInputChange('nickname', e.target.value)}
                            />
                            <button
                                className="signup-check-btn"
                                type="button"
                                onClick={() => handleDuplicateCheck('nickname')}
                                disabled={validationStates.nickname.status === 'loading'}
                            >
                                중복 확인
                            </button>
                        </div>
                    </div>
                    <div className={`validation-message ${validationStates.nickname.status}`}>
                        {validationStates.nickname.message}
                    </div>

                    {/* 이메일 */}
                    <div className="signup-row">
                        <div className="signup-input-container">
                            <input
                                className={`signup-input ${validationStates.email.status}`}
                                type="email"
                                placeholder="이메일을 입력하세요"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                            />
                            <button
                                className="signup-check-btn"
                                type="button"
                                onClick={() => handleDuplicateCheck('email')}
                                disabled={validationStates.email.status === 'loading'}
                            >
                                중복 확인
                            </button>
                        </div>
                    </div>
                    <div className={`validation-message ${validationStates.email.status}`}>
                        {validationStates.email.message}
                    </div>

                    {/* 휴대전화번호 */}
                    <div className="signup-row">
                        <input
                            className="signup-input"
                            type="text"
                            placeholder="휴대전화번호를 입력하세요"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                    </div>

                    {/* 주소 */}
                    <div className="signup-row">
                        <div className="signup-input-container">
                            <input
                                className="signup-input"
                                type="text"
                                placeholder="주소를 검색하세요"
                                value={formData.address}
                                readOnly
                            />
                            <button
                                className="signup-check-btn"
                                type="button"
                                onClick={handleAddressSearch}
                            >
                                주소 검색
                            </button>
                        </div>
                    </div>


                    {/* 우편번호 검색 모달 - 폼 마지막에 추가 */}
                    {isPostcodeOpen && (
                        <div className="postcode-overlay">
                            <div className="postcode-modal">
                                <div className="postcode-header">
                                    <h3>주소 검색</h3>
                                    <button
                                        className="postcode-close"
                                        onClick={() => setIsPostcodeOpen(false)}
                                    >
                                        ×
                                    </button>
                                </div>
                                <DaumPostcode
                                    onComplete={handleAddressComplete}
                                    autoClose={false}
                                    style={{
                                        width: '100%',
                                        height: '400px'
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* 약관 동의 */}
                    <div className="signup-agree">
                        <label>
                            <input
                                type="checkbox"
                                checked={Object.values(agreements).every(Boolean)}
                                onChange={(e) => handleAllAgreements(e.target.checked)}
                            />
                            전체동의
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                checked={agreements.terms}
                                onChange={(e) => handleAgreementChange('terms', e.target.checked)}
                            />
                            (필수) 이용약관에 동의합니다
                            <span
                                className="agreement-link"
                                onClick={() => openModal('terms')}
                            >
                                보기
                            </span>
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                checked={agreements.privacy}
                                onChange={(e) => handleAgreementChange('privacy', e.target.checked)}
                            />
                            (필수) 개인정보 수집 및 이용에 동의합니다
                            <span
                                className="agreement-link"
                                onClick={() => openModal('privacy')}
                            >
                                보기
                            </span>
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                checked={agreements.age}
                                onChange={(e) => handleAgreementChange('age', e.target.checked)}
                            />
                            (필수) 14세 이상입니다
                            <span
                                className="agreement-link"
                                onClick={() => openModal('age')}
                            >
                                보기
                            </span>
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                checked={agreements.location}
                                onChange={(e) => handleAgreementChange('location', e.target.checked)}
                            />
                            (선택) 위치서비스 이용동의
                            <span
                                className="agreement-link"
                                onClick={() => openModal('location')}
                            >
                                보기
                            </span>
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                checked={agreements.push}
                                onChange={(e) => handleAgreementChange('push', e.target.checked)}
                            />
                            (선택) 푸시 알림 이용동의
                            <span
                                className="agreement-link"
                                onClick={() => openModal('push')}
                            >
                                보기
                            </span>
                        </label>
                    </div>

                    <button
                        className={`signup-btn ${isFormValid ? 'active' : ''}`}
                        type="submit"
                        disabled={!isFormValid}
                    >
                        회원가입
                    </button>
                </form>
            </div>

            {/* 모달들 */}
            <ContentModal
                open={modalStates.terms}
                title="이용약관"
                content={MODAL_CONTENTS.terms}
                onClose={() => closeModal('terms')}
            />

            <ContentModal
                open={modalStates.privacy}
                title="개인정보처리방침"
                content={MODAL_CONTENTS.privacy}
                onClose={() => closeModal('privacy')}
            />

            <ContentModal
                open={modalStates.age}
                title="14세 이상 이용 안내"
                content={MODAL_CONTENTS.age}
                onClose={() => closeModal('age')}
            />

            <ContentModal
                open={modalStates.location}
                title="위치서비스 이용약관"
                content={MODAL_CONTENTS.location}
                onClose={() => closeModal('location')}
            />

            <ContentModal
                open={modalStates.push}
                title="푸시 알림 서비스 이용약관"
                content={MODAL_CONTENTS.push}
                onClose={() => closeModal('push')}
            />
        </div>
    );
}