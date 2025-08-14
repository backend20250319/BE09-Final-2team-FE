"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from "@/components/common/Sidebar";
import ConfirmModal, { MODAL_TYPES } from "@/components/common/ConfirmModal";
import { validatePasswordStrength, validatePasswordMatch, PASSWORD_CONFIG } from '@/app/(user)/components/passwordUtils';
import './password-change.css';

const PasswordChange = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [validationStates, setValidationStates] = useState({
        currentPassword: { status: 'default', message: '', checked: false },
        newPassword: { status: 'default', message: '' },
        confirmPassword: { status: 'default', message: '' }
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    const [isPasswordChanged, setIsPasswordChanged] = useState(false); // 추가

    // 현재 비밀번호 확인 (API 호출 시뮬레이션)
    const verifyCurrentPassword = async (password) => {
        return new Promise(resolve => {
            setTimeout(() => {
                // 실제로는 API 호출로 현재 비밀번호 확인
                const isCorrect = password === 'correct123'; // 임시 비밀번호
                resolve({
                    isValid: isCorrect,
                    message: isCorrect ? '현재 비밀번호가 확인되었습니다' : '현재 비밀번호가 일치하지 않습니다'
                });
            }, 1000);
        });
    };

    // 비밀번호 유효성 검사 (유틸리티 사용)
    // 비밀번호 확인 검사 (유틸리티 사용)

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // 현재 비밀번호 입력 시 확인 상태 초기화
        if (name === 'currentPassword' && validationStates.currentPassword.checked) {
            setValidationStates(prev => ({
                ...prev,
                currentPassword: { status: 'default', message: '', checked: false }
            }));
        }

        // 실시간 검증
        if (name === 'newPassword') {
            const validation = validatePasswordStrength(value);
            setValidationStates(prev => ({
                ...prev,
                newPassword: {
                    status: value.trim() === '' ? 'default' : (validation.isValid ? 'success' : 'error'),
                    message: value.trim() === '' ? '' : validation.message
                }
            }));

            // 새 비밀번호가 변경되면 확인 비밀번호도 다시 검증
            if (formData.confirmPassword) {
                const confirmValidation = validatePasswordMatch(value, formData.confirmPassword);
                setValidationStates(prev => ({
                    ...prev,
                    confirmPassword: {
                        status: confirmValidation.isValid ? 'success' : 'error',
                        message: confirmValidation.message
                    }
                }));
            }
        }

        if (name === 'confirmPassword') {
            const validation = validatePasswordMatch(formData.newPassword, value);
            setValidationStates(prev => ({
                ...prev,
                confirmPassword: {
                    status: value.trim() === '' ? 'default' : (validation.isValid ? 'success' : 'error'),
                    message: value.trim() === '' ? '' : validation.message
                }
            }));
        }
    };

    // 현재 비밀번호 확인
    const handleCurrentPasswordVerify = async () => {
        if (!formData.currentPassword.trim()) {
            setValidationStates(prev => ({
                ...prev,
                currentPassword: { status: 'error', message: '현재 비밀번호를 입력해주세요', checked: false }
            }));
            return;
        }

        setValidationStates(prev => ({
            ...prev,
            currentPassword: { status: 'loading', message: '🔄 확인 중...', checked: false }
        }));

        try {
            const result = await verifyCurrentPassword(formData.currentPassword);
            setValidationStates(prev => ({
                ...prev,
                currentPassword: {
                    status: result.isValid ? 'success' : 'error',
                    message: result.isValid ? '✅ ' + result.message : '❌ ' + result.message,
                    checked: result.isValid
                }
            }));
        } catch (error) {
            setValidationStates(prev => ({
                ...prev,
                currentPassword: { status: 'error', message: '❌ 확인 중 오류가 발생했습니다', checked: false }
            }));
        }
    };

    // 비밀번호 변경 실행
    const handlePasswordChange = async () => {
        setIsLoading(true);

        // 실제로는 API 호출
        setTimeout(() => {
            console.log('비밀번호 변경 완료:', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });
            setIsLoading(false);
            setIsPasswordChanged(true); // 변경 완료 상태 설정
            setIsCompleteModalOpen(true);
        }, 1000);
    };

    const handleCompleteModalClose = () => {
        setIsCompleteModalOpen(false);
        // 필요시 페이지 이동 또는 폼 초기화
    };

    // 변경 버튼 활성화 조건
    const isChangeEnabled =
        !isPasswordChanged && // 이미 변경되었으면 비활성화
        validationStates.currentPassword.checked &&
        validationStates.newPassword.status === 'success' &&
        validationStates.confirmPassword.status === 'success' &&
        !isLoading;

    return (
        <>
            <Sidebar
                sidebarKey="password-change"
                title="비밀번호 변경"
                trigger={<span style={{display: 'none'}}>숨김</span>}
                onBack={true}
            >
                <div className="password-change-content">
                    <div className="top-section">
                        {/* 현재 비밀번호 */}
                        <div className="input-field">
                            <div className="input-with-verify">
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleInputChange}
                                    className={`password-input ${validationStates.currentPassword.status === 'error' ? 'error' : ''}`}
                                    placeholder="현재 비밀번호를 입력하세요"
                                />
                                <button
                                    type="button"
                                    className="verify-btn"
                                    onClick={handleCurrentPasswordVerify}
                                    disabled={isLoading || validationStates.currentPassword.checked}
                                >
                                    {validationStates.currentPassword.status === 'loading' ? '확인중...' :
                                        validationStates.currentPassword.checked ? '✓ 확인됨' : '확인'}
                                </button>
                            </div>
                            {validationStates.currentPassword.message && (
                                <div className={`message ${validationStates.currentPassword.status === 'success' ? 'success' : 'error'}`}>
                                    {validationStates.currentPassword.message}
                                </div>
                            )}
                        </div>

                        {/* 안내 메시지 제거 */}

                        {/* 새 비밀번호 */}
                        <div className="input-field">
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                className={`password-input ${validationStates.newPassword.status === 'error' ? 'error' : ''}`}
                                placeholder={PASSWORD_CONFIG.placeholder}
                                maxLength={PASSWORD_CONFIG.maxLength}
                            />
                            {validationStates.newPassword.message && (
                                <div className={`message ${validationStates.newPassword.status === 'success' ? 'success' : 'error'}`}>
                                    {validationStates.newPassword.message}
                                </div>
                            )}
                        </div>

                        {/* 새 비밀번호 재입력 */}
                        <div className="input-field">
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className={`password-input ${validationStates.confirmPassword.status === 'error' ? 'error' : ''}`}
                                placeholder={PASSWORD_CONFIG.confirmPlaceholder}
                                maxLength={PASSWORD_CONFIG.maxLength}
                            />
                            {validationStates.confirmPassword.message && (
                                <div className={`message ${validationStates.confirmPassword.status === 'success' ? 'success' : 'error'}`}>
                                    {validationStates.confirmPassword.message}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 버튼 섹션 */}
                    <div className="bottom-section">
                        <button
                            className={`action-btn primary ${isChangeEnabled ? 'enabled' : 'disabled'}`}
                            onClick={handlePasswordChange}
                            disabled={!isChangeEnabled}
                        >
                            {isPasswordChanged ? '비밀번호 변경 완료' : (isLoading ? '변경 중...' : '비밀번호 변경')}
                        </button>
                    </div>
                </div>
            </Sidebar>

            {/* 비밀번호 변경 완료 모달 */}
            <ConfirmModal
                open={isCompleteModalOpen}
                title="비밀번호 변경 완료"
                message="비밀번호가 성공적으로 변경되었습니다."
                onConfirm={handleCompleteModalClose}
                onCancel={handleCompleteModalClose}
                type={MODAL_TYPES.CONFIRM_ONLY}
                confirmText="확인"
            />
        </>
    );
};

export default PasswordChange;