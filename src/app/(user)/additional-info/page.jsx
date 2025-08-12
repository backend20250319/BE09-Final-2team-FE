"use client";

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './additional-info.css';
import DaumPostcode from 'react-daum-postcode';

export default function AdditionalInfo() {
    const router = useRouter();

    // 카카오 사용자 정보 (실제로는 props나 context에서 받아올 수 있음)
    const [kakaoUserInfo] = useState({
        nickname: "카카오 프로필 닉네임", // 실제로는 카카오 로그인에서 받은 데이터
        email: "user@kakao.com"
    });

    // 폼 데이터 상태
    const [formData, setFormData] = useState({
        name: '', // 카카오 닉네임으로 자동 설정할 수 있음
        nickname: '',
        address: '',
        agreeToTerms: false
    });

    // 우편번호 모달 상태
    const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

    // 중복 확인 상태 (닉네임만)
    const [validationStates, setValidationStates] = useState({
        nickname: { status: 'default', message: '💡 중복 확인을 눌러주세요', checked: false }
    });

    // 폼 유효성 상태
    const [isFormValid, setIsFormValid] = useState(false);

    // 입력값 변경 핸들러
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // 닉네임 길이 검증
        if (field === 'nickname' && value) {
            if (value.length < 2) {
                setValidationStates(prev => ({
                    ...prev,
                    nickname: {
                        status: 'error',
                        message: '❌ 닉네임은 2글자 이상이어야 합니다',
                        checked: false
                    }
                }));
                return;
            } else if (value.length > 10) {
                setValidationStates(prev => ({
                    ...prev,
                    nickname: {
                        status: 'error',
                        message: '❌ 닉네임은 10글자 이하여야 합니다',
                        checked: false
                    }
                }));
                return;
            }

            setValidationStates(prev => ({
                ...prev,
                nickname: {
                    status: 'default',
                    message: '💡 중복 확인을 눌러주세요',
                    checked: false
                }
            }));
        }
    };

    // 체크박스 변경 핸들러
    const handleAgreementChange = (checked) => {
        setFormData(prev => ({
            ...prev,
            agreeToTerms: checked
        }));
    };

    // 중복 확인 API 호출 (기존 회원가입과 동일)
    const checkDuplicate = async (type, value) => {
        return new Promise(resolve => {
            setTimeout(() => {
                const duplicates = {
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

    // 중복 확인 핸들러 (기존 회원가입과 동일)
    const handleDuplicateCheck = async () => {
        const value = formData.nickname;

        if (!value.trim()) {
            setValidationStates(prev => ({
                ...prev,
                nickname: {
                    status: 'error',
                    message: '❌ 입력값을 확인해주세요',
                    checked: false
                }
            }));
            return;
        }

        // 길이 검증 실패 시 중복 확인 진행하지 않음
        if (value.length < 2 || value.length > 10) {
            return;
        }

        // 로딩 상태
        setValidationStates(prev => ({
            ...prev,
            nickname: { status: 'loading', message: '🔄 확인 중...', checked: false }
        }));

        try {
            const result = await checkDuplicate('nickname', value);

            setValidationStates(prev => ({
                ...prev,
                nickname: {
                    status: result.available ? 'success' : 'error',
                    message: result.available
                        ? '✅ 사용 가능한 닉네임입니다'
                        : `❌ ${result.message}`,
                    checked: result.available
                }
            }));
        } catch (error) {
            setValidationStates(prev => ({
                ...prev,
                nickname: {
                    status: 'error',
                    message: '❌ 확인 중 오류가 발생했습니다',
                    checked: false
                }
            }));
        }
    };

    // 주소 검색 완료 핸들러 (기존 회원가입과 동일)
    const handleAddressComplete = (data) => {
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

        handleInputChange('address', fullAddress);
        setIsPostcodeOpen(false);
    };

    // 주소 검색 버튼 클릭 핸들러
    const handleAddressSearch = () => {
        setIsPostcodeOpen(true);
    };

    // 폼 유효성 검사 (기존 회원가입 패턴 활용)
    useEffect(() => {
        const requiredFields = ['name', 'nickname', 'address'];

        const isFieldsValid = requiredFields.every(field => formData[field].trim() !== '');
        const isNicknameValid = validationStates.nickname.checked;
        const isAgreementValid = formData.agreeToTerms;

        setIsFormValid(isFieldsValid && isNicknameValid && isAgreementValid);
    }, [formData, validationStates]);

    // 폼 제출 핸들러 - URL 파라미터 추가
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isFormValid) {
            router.push(`/signup/complete?from=kakao&nickname=${encodeURIComponent(formData.nickname)}`); // 카카오 플로우 닉네임을 URL 파라미터로 전달
        }
    };

    return (
        <div className="additional-info-container">
            <div className="additional-info-card">
                <div className="card-content">
                    {/* 로고 이미지 */}
                    <Link href="/">
                        <div className="image-container">
                            <img
                                src="/images/common/main-logo.png"
                                alt="Momnect 로고"
                                className="logo-image"
                            />
                        </div>
                    </Link>

                    {/* 제목 */}
                    <h1 className="page-title">
                        추가정보 입력
                    </h1>

                    {/* 환영 메시지 */}
                    <div className="welcome-message">
                        🎉 {kakaoUserInfo.nickname}님, 환영합니다!
                    </div>

                    {/* 입력 폼 */}
                    <form className="form-container" onSubmit={handleSubmit}>
                        {/* 이름 입력 */}
                        <div className="input-group">
                            <input
                                className="input-field"
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="이름을 입력하세요"
                                required
                            />
                        </div>

                        {/* 닉네임 입력 */}
                        <div className="input-group">
                            <input
                                className={`input-field ${validationStates.nickname.status}`}
                                type="text"
                                value={formData.nickname}
                                onChange={(e) => handleInputChange('nickname', e.target.value)}
                                placeholder="닉네임을 입력하세요 (2~10자)"
                                required
                            />
                            <button
                                className="duplicate-check-btn"
                                type="button"
                                onClick={handleDuplicateCheck}
                                disabled={validationStates.nickname.status === 'loading'}
                            >
                                {validationStates.nickname.status === 'loading' ? '확인중...' : '중복 확인'}
                            </button>
                        </div>

                        {/* 닉네임 검증 메시지 */}
                        {validationStates.nickname.message && (
                            <div className={`validation-message ${validationStates.nickname.status}`}>
                                {validationStates.nickname.message}
                            </div>
                        )}

                        {/* 주소 입력 */}
                        <div className="input-group">
                            <input
                                className="input-field"
                                type="text"
                                value={formData.address}
                                placeholder="주소를 검색하세요"
                                onClick={handleAddressSearch}
                                readOnly
                                required
                            />
                            <button
                                className="address-search-btn"
                                type="button"
                                onClick={handleAddressSearch}
                            >
                                주소 검색
                            </button>
                        </div>

                        {/* 개인정보 동의 */}
                        <div className="agreement-container">
                            <label className="checkbox-label">
                                <input
                                    className="checkbox-input"
                                    type="checkbox"
                                    checked={formData.agreeToTerms}
                                    onChange={(e) => handleAgreementChange(e.target.checked)}
                                />
                                <span className="checkbox-custom">
                                    {formData.agreeToTerms && <span className="checkmark">✓</span>}
                                </span>
                                <span className="agreement-text">
                                    개인정보 수집 이용에 동의합니다
                                </span>
                            </label>
                        </div>

                        {/* 가입 완료 버튼 */}
                        <button
                            className={`submit-button ${isFormValid ? 'active' : ''}`}
                            type="submit"
                            disabled={!isFormValid}
                        >
                            가입 완료
                        </button>
                    </form>
                </div>
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
        </div>
    );
}