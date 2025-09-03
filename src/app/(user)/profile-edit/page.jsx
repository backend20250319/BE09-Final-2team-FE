"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from "@/components/common/Sidebar";
import ConfirmModal, { MODAL_TYPES } from "@/components/common/ConfirmModal";
import { createValidationSetter, createDuplicateCheckHandler } from '@/app/(user)/components/duplicateUtils';
import { validateEmail } from '@/app/(user)/components/emailUtils';
import { formatPhoneNumber, validatePhoneNumber } from '@/app/(user)/components/phoneUtils';
import './profile-edit.css';
import { userAPI } from '@/lib/api';

const ProfileEdit = ({ currentUserInfo, onProfileUpdate }) => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        nickname: '',
        email: '',
        phone: ''
    });

    const [validationStates, setValidationStates] = useState({
        nickname: { status: 'default', message: '', checked: false },
        email: { status: 'default', message: '', checked: false },
        phone: { status: 'default', message: '', checked: false }
    });

    const [isLoading, setIsLoading] = useState(false);
    // 프로필 수정 확인 모달 (저장하시겠습니까?)
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    // 프로필 수정 완료 모달 (수정되었습니다)
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const setValidationMessage = createValidationSetter(setValidationStates);

    // 중복 확인 핸들러 생성
    const handleDuplicateCheck = async (type) => {
        try {
            const response = await userAPI.checkDuplicate(type, formData[type]);
            const isDuplicate = response.data.isDuplicate;

            if (isDuplicate) {
                setValidationMessage(type, 'error', '이미 사용 중입니다.');
            } else {
                setValidationMessage(type, 'success', '사용 가능합니다.', true);
            }
        } catch (error) {
            setValidationMessage(type, 'error', '확인 중 오류가 발생했습니다.');
        }
    };

    // 컴포넌트 마운트 시 현재 사용자 정보로 초기화
    useEffect(() => {
        // currentUserInfo가 존재하면 폼 데이터를 업데이트
        if (currentUserInfo) {
            setFormData({
                nickname: currentUserInfo.nickname || '',
                email: currentUserInfo.email || '',
                phone: currentUserInfo.phoneNumber || ''
            });
        }
    }, [currentUserInfo]); // currentUserInfo가 바뀔 때마다 실행

    // 변경사항 감지
    useEffect(() => {
        if (currentUserInfo) {
            // formData가 업데이트된 후 변경사항을 감지
            const isChanged =
                formData.nickname !== (currentUserInfo.nickname || '') ||
                formData.email !== (currentUserInfo.email || '') ||
                formData.phone !== (currentUserInfo.phoneNumber || currentUserInfo.phone || '');
            setHasChanges(isChanged);
        }
    }, [formData, currentUserInfo]);

    const handleInputChange = (e) => {
        let { name, value } = e.target;

        // 휴대전화번호 자동 포맷팅
        if (name === 'phone') {
            value = formatPhoneNumber(value);
        }

        setFormData(prev => ({ ...prev, [name]: value }));

        // 입력값이 변경되면 중복 확인 상태 초기화 (닉네임, 이메일만)
        if ((name === 'nickname' || name === 'email') && validationStates[name].checked) {
            setValidationMessage(name, 'default', '', false);
        }

        // 실시간 기본 검증
        let validation = { isValid: true, message: '' };

        if (name === 'nickname') {
            // 닉네임은 중복 확인 버튼에서 처리하므로 여기서는 기본 검증만
            if (value.trim() === '') {
                setValidationMessage(name, 'default', '');
            } else if (value.length < 2 || value.length > 10) {
                const message = value.length < 2 ? '닉네임은 2글자 이상 입력해주세요' : '닉네임은 10글자 이하로 입력해주세요';
                setValidationMessage(name, 'error', message);
            } else {
                setValidationMessage(name, 'default', '');
            }
        } else if (name === 'email') {
            validation = validateEmail(value);
            if (!validation.isValid && value.trim() !== '') {
                setValidationMessage(name, 'error', validation.message);
            } else {
                setValidationMessage(name, 'default', '');
            }
        } else if (name === 'phone') {
            validation = validatePhoneNumber(value);
            if (!validation.isValid && value.trim() !== '') {
                setValidationMessage(name, 'error', validation.message);
            } else if (validation.isValid) {
                setValidationMessage(name, 'success', validation.message);
            } else {
                setValidationMessage(name, 'default', '');
            }
        }
    };

    // 프로필 수정 버튼 클릭 시 - 확인 모달 표시
    const handleSaveClick = () => {
        setIsConfirmModalOpen(true);
    };

    const handleSaveConfirm = async () => {
        setIsConfirmModalOpen(false);
        setIsLoading(true);

        try {
            // 부모에게 전달해서 실제 API 호출
            if (onProfileUpdate) {
                await onProfileUpdate(formData);
            }

            setIsCompleteModalOpen(true);
        } catch (error) {
            console.error('프로필 수정 실패:', error);
            // 에러 모달이나 알림 표시
        } finally {
            setIsLoading(false);
        }
    };

    // 확인 모달에서 "취소" 클릭 시
    const handleSaveCancel = () => {
        setIsConfirmModalOpen(false);
    };

    // 완료 모달 닫기
    const handleCompleteModalClose = () => {
        setIsCompleteModalOpen(false);
    };

    // 변경사항이 있는지 확인하는 헬퍼 함수
    const hasFieldChanged = (field) => {
        // 백엔드 키와 프론트엔드 키를 매핑
        const userInfoKey = {
            'nickname': 'nickname',
            'email': 'email',
            'phone': 'phoneNumber',
        };

        const key = userInfoKey[field];

        if (!currentUserInfo) return false;

        // 기존 값과 현재 폼 데이터 값을 비교
        return formData[field] !== (currentUserInfo[key] || '');
    };

    // 저장 버튼 활성화 조건
    const isSaveEnabled = hasChanges &&
        (!hasFieldChanged('nickname') || validationStates.nickname.checked) &&
        (!hasFieldChanged('email') || validationStates.email.checked) &&
        (!hasFieldChanged('phone') || validationStates.phone.status === 'success');

    return (
        <>
            <Sidebar
                sidebarKey="profile-edit"
                title="프로필 수정"
                trigger={<span style={{display: 'none'}}>숨김</span>}
                onBack={true}
            >
                <div className="profile-edit-content">
                    <div className="top-section">
                        {/* 닉네임 */}
                        <div className="input-field">
                            <div className="input-with-verify">
                                <input
                                    type="text"
                                    name="nickname"
                                    value={formData.nickname}
                                    onChange={handleInputChange}
                                    className={`profile-input ${validationStates.nickname.status === 'error' ? 'error' : ''}`}
                                    placeholder="닉네임을 입력해주세요 (최대 2~10자)"
                                    maxLength={10}
                                />
                                <button
                                    type="button"
                                    className="verify-btn"
                                    onClick={() => handleDuplicateCheck('nickname')}
                                    disabled={isLoading || validationStates.nickname.checked}
                                >
                                    {validationStates.nickname.status === 'loading' ? '확인중...' :
                                        validationStates.nickname.checked ? '✓ 확인됨' : '중복 확인'}
                                </button>
                            </div>
                            {validationStates.nickname.message && (
                                <div className={`message ${validationStates.nickname.status === 'success' ? 'success' : 'error'}`}>
                                    {validationStates.nickname.message}
                                </div>
                            )}
                        </div>

                        {/* 이메일 */}
                        <div className="input-field">
                            <div className="input-with-verify">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`profile-input ${validationStates.email.status === 'error' ? 'error' : ''}`}
                                    placeholder="이메일을 입력해주세요"
                                />
                                <button
                                    type="button"
                                    className="verify-btn"
                                    onClick={() => handleDuplicateCheck('email')}
                                    disabled={isLoading || validationStates.email.checked}
                                >
                                    {validationStates.email.status === 'loading' ? '확인중...' :
                                        validationStates.email.checked ? '✓ 확인됨' : '중복 확인'}
                                </button>
                            </div>
                            {validationStates.email.message && (
                                <div className={`message ${validationStates.email.status === 'success' ? 'success' : 'error'}`}>
                                    {validationStates.email.message}
                                </div>
                            )}
                        </div>

                        {/* 휴대전화번호 */}
                        <div className="input-field">
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className={`profile-input ${validationStates.phone.status === 'error' ? 'error' : ''}`}
                                placeholder="휴대전화번호를 입력해주세요"
                                maxLength={13}
                            />
                            {validationStates.phone.message && (
                                <div className={`message ${validationStates.phone.status === 'success' ? 'success' : 'error'}`}>
                                    {validationStates.phone.message}
                                </div>
                            )}
                        </div>

                        {/* 안내 메시지 */}
                        <div className="help-message">
                            <span className="help-icon">💡</span>
                            <span className="help-text">중복 확인을 눌러주세요</span>
                        </div>
                    </div>

                    {/* 버튼 섹션 */}
                    <div className="bottom-section">
                        <button
                            className={`action-btn primary ${isSaveEnabled ? 'enabled' : 'disabled'}`}
                            onClick={handleSaveClick}
                            disabled={!isSaveEnabled}
                        >
                            프로필 수정
                        </button>
                    </div>
                </div>
            </Sidebar>

            {/* 프로필 수정 확인 모달 (저장하시겠습니까?) */}
            <ConfirmModal
                open={isConfirmModalOpen}
                title="프로필 수정"
                message="변경사항을 저장하시겠습니까?"
                onConfirm={handleSaveConfirm}
                onCancel={handleSaveCancel}
                type={MODAL_TYPES.CONFIRM_CANCEL}
                confirmText="저장"
                cancelText="취소"
            />

            {/* 프로필 수정 완료 모달 (수정되었습니다) */}
            <ConfirmModal
                open={isCompleteModalOpen}
                title="프로필 수정 완료"
                message="프로필이 성공적으로 수정되었습니다."
                onConfirm={handleCompleteModalClose}
                onCancel={handleCompleteModalClose}
                type={MODAL_TYPES.CONFIRM_ONLY}
                confirmText="확인"
            />
        </>
    );
};

export default ProfileEdit;