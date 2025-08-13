"use client";

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './signup.css';
import { validatePassword, PASSWORD_CONFIG } from '@/app/(user)/components/passwordUtils';
import { formatPhoneNumber, PHONE_CONFIG } from '@/app/(user)/components/phoneUtils';
import { createValidationSetter, createDuplicateCheckHandler, handleNicknameValidation } from '@/app/(user)/components/duplicateUtils';
import ContentModal from '@/app/(user)/signup/components/ContentModal';
import { MODAL_CONTENTS } from '@/app/(user)/signup/constants/modalContents';
import DaumPostcode from 'react-daum-postcode';
import { processAddressData } from '@/app/(user)/components/addressUtils';
import { useUserStore } from '@/store/userStore';

export default function Signup() {
    const router = useRouter();

    // Zustand 스토어 사용
    const { userInfo, updateUserInfo, updateField, updateAgreements, processSignup } = useUserStore();

    // 폼 데이터 상태
    const [formData, setFormData] = useState({
        name: userInfo.name || '',
        loginId: userInfo.loginId || '',
        password: userInfo.password || '',
        passwordConfirm: '',
        nickname: userInfo.nickname || '',
        email: userInfo.email || '',
        phone: userInfo.phone || '',
        address: userInfo.address || ''
    });

    // 체크박스 상태
    const [agreements, setAgreements] = useState(userInfo.agreements);

    // 모달 상태
    const [modalStates, setModalStates] = useState({
        terms: false,
        privacy: false,
        age: false,
        location: false,
        push: false
    });

    // 우편번호 모달 상태
    const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

    // 중복 확인 상태
    const [validationStates, setValidationStates] = useState({
        loginId: { status: 'default', message: '💡 중복 확인을 눌러주세요', checked: false },
        email: { status: 'default', message: '💡 중복 확인을 눌러주세요', checked: false },
        nickname: { status: 'default', message: '💡 중복 확인을 눌러주세요', checked: false }
    });

    // 검증 메시지 설정 함수 생성
    const setValidationMessage = createValidationSetter(setValidationStates);

    // 기타 검증 상태
    const [passwordMatch, setPasswordMatch] = useState({ status: 'default', message: '' });
    const [isFormValid, setIsFormValid] = useState(false);

    // 중복 확인 핸들러 생성
    const handleDuplicateCheck = createDuplicateCheckHandler(formData, setValidationMessage);

    // 스토어 상태 변경 시 로컬 상태 동기화
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            name: userInfo.name || '',
            loginId: userInfo.loginId || '',
            password: userInfo.password || '',
            nickname: userInfo.nickname || '',
            email: userInfo.email || '',
            phone: userInfo.phone || '',
            address: userInfo.address || ''
        }));
    }, [userInfo.name, userInfo.loginId, userInfo.password, userInfo.nickname, userInfo.email, userInfo.phone, userInfo.address]);

    // 약관 동의 상태 동기화
    useEffect(() => {
        setAgreements(prev => ({ ...prev, ...userInfo.agreements }));
    }, [userInfo.agreements]);

    // 닉네임 자동 검증 - 컴포넌트 마운트 시 실행
    useEffect(() => {
        if (formData.nickname.trim() === '') {
            setValidationStates(prev => ({
                ...prev,
                nickname: {
                    status: 'success',
                    message: '✅ 아이디가 닉네임이 됩니다',
                    checked: true
                }
            }));
        }
    }, []);

    // 모달 열기/닫기 함수
    const openModal = (type) => {
        setModalStates(prev => ({ ...prev, [type]: true }));
    };

    const closeModal = (type) => {
        setModalStates(prev => ({ ...prev, [type]: false }));
    };

    // 입력값 변경 핸들러
    const handleInputChange = (field, value) => {
        if (field === 'phone') {
            value = formatPhoneNumber(value);
        }

        setFormData(prev => ({ ...prev, [field]: value }));

        if (field !== 'passwordConfirm' && field !== 'nickname') {
            updateField(field, value);
        }

        // 중복 확인 상태 초기화
        if (['loginId', 'email', 'nickname'].includes(field)) {
            if (field === 'nickname') {
                const shouldContinue = handleNicknameValidation(value, setValidationMessage);
                if (!shouldContinue) return;
            }

            // 일반 필드들 (loginId, email, nickname 길이 체크 통과한 경우)
            setValidationMessage(field, 'default', '💡 중복 확인을 눌러주세요');
        }

        // 비밀번호 확인 검증
        if (field === 'passwordConfirm' || field === 'password') {
            const password = field === 'password' ? value : formData.password;
            const passwordConfirm = field === 'passwordConfirm' ? value : formData.passwordConfirm;
            const result = validatePassword(password, passwordConfirm);
            setPasswordMatch(result);
        }
    };

    // 체크박스 변경 핸들러
    const handleAgreementChange = (field, checked) => {
        const newAgreements = {
            ...agreements,
            [field]: checked
        };
        setAgreements(newAgreements);
        updateAgreements({ [field]: checked });
    };

    // 전체 동의 체크박스
    const handleAllAgreements = (checked) => {
        const newAgreements = {
            terms: checked,
            privacy: checked,
            age: checked,
            location: checked,
            push: checked
        };
        setAgreements(newAgreements);
        updateAgreements(newAgreements);
    };

    // 주소 검색 완료 핸들러
    const handleAddressComplete = (data) => {
        const processedAddress = processAddressData(data, true); // 도로명 주소
        setFormData(prev => ({ ...prev, address: processedAddress }));
        setIsPostcodeOpen(false);
    };

    // 주소 검색 버튼 클릭 핸들러
    const handleAddressSearch = () => {
        setIsPostcodeOpen(true);
    };

    // 폼 유효성 검사
    useEffect(() => {
        const requiredFields = ['name', 'loginId', 'password', 'passwordConfirm', 'email', 'phone', 'address'];
        const requiredAgreements = ['terms', 'privacy', 'age'];
        const requiredChecks = ['loginId', 'email'];

        const isFieldsValid = requiredFields.every(field => formData[field].trim());
        const isAgreementsValid = requiredAgreements.every(field => agreements[field]);
        const isChecksValid = requiredChecks.every(field =>
            formData[field] === '' || validationStates[field].checked
        );

        const isPasswordValid = formData.passwordConfirm ?
            passwordMatch.status === 'success' :
            formData.password.length >= 8;

        const isNicknameValid = formData.nickname.trim() === '' || validationStates.nickname.checked;

        setIsFormValid(
            isFieldsValid &&
            isAgreementsValid &&
            isChecksValid &&
            isPasswordValid &&
            isNicknameValid
        );
    }, [formData, agreements, validationStates, passwordMatch]);

    // 폼 제출 핸들러
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isFormValid) {
            const storeData = {
                name: formData.name,
                loginId: formData.loginId,
                password: formData.password,
                nickname: formData.nickname,
                email: formData.email,
                phone: formData.phone,
                address: formData.address
            };

            // 스토어에 사용자 정보 업데이트
            updateUserInfo({
                ...storeData,
                agreements,
                signupType: 'normal',
                signupStep: 3
            });

            // 로컬스토리지에 회원 정보 저장
            processSignup({
                ...storeData,
                agreements,
                signupType: 'normal'
            });

            router.push('/signup/complete');
        }
    };

    return (
        <div className="signup-root">
            <div className="signup-card">
                {/* 로고 이미지 */}
                <Link href="/">
                    <div className="signup-image" style={{cursor: 'pointer'}}>
                        <img
                            src="/images/common/main-logo.png"
                            alt="Momnect 로고"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '8px'
                            }}
                        />
                    </div>
                </Link>
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
                            placeholder={PASSWORD_CONFIG.placeholder}
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            maxLength={PASSWORD_CONFIG.maxLength}
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
                            placeholder={PHONE_CONFIG.placeholder}
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            maxLength={PHONE_CONFIG.maxLength}
                        />
                    </div>

                    {/* 주소 */}
                    <div className="signup-row">
                        <div className="signup-input-container">
                            <input
                                className={`signup-input ${formData.address ? 'has-address' : ''}`}
                                type="text"
                                placeholder="주소를 검색하세요"
                                value={formData.address}
                                onClick={handleAddressSearch}
                                readOnly
                            />
                            {!formData.address && (
                                <button
                                    className="signup-check-btn"
                                    type="button"
                                    onClick={handleAddressSearch}
                                >
                                    주소 검색
                                </button>
                            )}
                        </div>
                    </div>

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

            {/* 우편번호 검색 모달 */}
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

            {/* 약관 모달들 */}
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