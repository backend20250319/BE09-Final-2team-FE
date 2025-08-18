"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from "@/components/common/Sidebar";
import ConfirmModal, { MODAL_TYPES } from "@/components/common/ConfirmModal";
import './child-management.css';

const ChildManagement = () => {
    const router = useRouter();

    // 현재 저장된 자녀 정보 (실제로는 API에서 가져올 데이터)
    const [savedChildren] = useState([
        // { id: 1, nickname: '첫째', birthDate: '2020-03-15', age: 4 },
        // { id: 2, nickname: '둘째', birthDate: '2022-07-20', age: 2 }
    ]);

    const [childForms, setChildForms] = useState([
        { id: Date.now(), nickname: '', birthDate: '', age: null }
    ]);

    const [isLoading, setIsLoading] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    const [isChildrenSaved, setIsChildrenSaved] = useState(false);

    // 나이 계산 함수
    const calculateAge = (birthDate) => {
        if (!birthDate) return null;

        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return age;
    };

    // 입력값 변경 핸들러
    const handleInputChange = (id, field, value) => {
        // 입력값이 변경되면 저장 상태 초기화
        setIsChildrenSaved(false);

        setChildForms(prev => prev.map(form => {
            if (form.id === id) {
                const updatedForm = { ...form, [field]: value };

                // 생년월일이 변경되면 자동으로 나이 계산
                if (field === 'birthDate') {
                    updatedForm.age = calculateAge(value);
                }

                return updatedForm;
            }
            return form;
        }));
    };

    // 자녀 폼 추가
    const addChildForm = () => {
        if (childForms.length < 2) {
            setChildForms(prev => [
                ...prev,
                { id: Date.now(), nickname: '', birthDate: '', age: null }
            ]);
        }
    };

    // 자녀 폼 삭제
    const removeChildForm = (id) => {
        if (childForms.length > 1) {
            setIsChildrenSaved(false);
            setChildForms(prev => prev.filter(form => form.id !== id));
        }
    };

    // 저장 버튼 클릭
    const handleSaveClick = () => {
        setIsConfirmModalOpen(true);
    };

    // 저장 확인
    const handleSaveConfirm = async () => {
        setIsConfirmModalOpen(false);
        setIsLoading(true);

        // 실제로는 API 호출
        setTimeout(() => {
            console.log('저장된 자녀 정보:', childForms);
            setIsLoading(false);
            setIsChildrenSaved(true);
            setIsCompleteModalOpen(true);
        }, 1000);
    };

    const handleSaveCancel = () => {
        setIsConfirmModalOpen(false);
    };

    const handleCompleteModalClose = () => {
        setIsCompleteModalOpen(false);
    };

    // 저장 버튼 활성화 조건
    const isSaveEnabled = !isChildrenSaved &&
        childForms.length > 0 &&
        childForms.every(form => form.nickname.trim() !== '' && form.birthDate !== '') &&
        !isLoading;

    return (
        <>
            <Sidebar
                sidebarKey="child-management"
                title="자녀목록 관리"
                trigger={<span style={{display: 'none'}}>숨김</span>}
                onBack={true}
            >
                <div className="child-management-content">
                    <div className="top-section">
                        {/* 안내 메시지 */}
                        <div className="info-message">
                            자녀는 최대 2명까지 저장가능합니다.
                        </div>

                        {/* 자녀 폼들 */}
                        <div className="child-forms">
                            {childForms.map((form, index) => (
                                <div key={form.id} className="child-form">
                                    <div className="form-header">
                                        <h4 className="form-title">자녀목록 추가</h4>
                                        {childForms.length > 1 && (
                                            <button
                                                type="button"
                                                className="remove-btn"
                                                onClick={() => removeChildForm(form.id)}
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>

                                    {/* 애칭 입력 */}
                                    <div className="input-field">
                                        <label className="input-label">애칭 *</label>
                                        <input
                                            type="text"
                                            value={form.nickname}
                                            onChange={(e) => handleInputChange(form.id, 'nickname', e.target.value)}
                                            className="child-input"
                                            placeholder="우리 아이를 어떻게 부르시나요?"
                                            maxLength={10}
                                        />
                                        <div className="input-help">최대 10글자까지 입력 가능해요</div>
                                    </div>

                                    {/* 생년월일 입력 */}
                                    <div className="input-field">
                                        <label className="input-label">생년월일 *</label>
                                        <input
                                            type="date"
                                            value={form.birthDate}
                                            onChange={(e) => handleInputChange(form.id, 'birthDate', e.target.value)}
                                            className="child-input date-input"
                                            max={new Date().toISOString().split('T')[0]} // 오늘 날짜까지만 선택 가능
                                        />
                                        <div className="input-help">
                                            {form.age !== null ?
                                                `생년월일을 선택하면 자동으로 나이를 계산해 드려요 (현재 ${form.age}세)` :
                                                '생년월일을 선택하면 자동으로 나이를 계산해 드려요'
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 추가 버튼 */}
                        {childForms.length < 2 && (
                            <div className="add-child-section">
                                <button
                                    type="button"
                                    className="add-child-btn"
                                    onClick={addChildForm}
                                >
                                    + 추가
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 버튼 섹션 */}
                    <div className="bottom-section">
                        <button
                            className={`action-btn primary ${isSaveEnabled ? 'enabled' : 'disabled'}`}
                            onClick={handleSaveClick}
                            disabled={!isSaveEnabled}
                        >
                            {isChildrenSaved ? '자녀 정보 저장 완료' : (isLoading ? '저장 중...' : '자녀 정보 추가')}
                        </button>
                    </div>
                </div>
            </Sidebar>

            {/* 저장 확인 모달 */}
            <ConfirmModal
                open={isConfirmModalOpen}
                title="자녀 정보 저장"
                message="입력한 자녀 정보를 저장하시겠습니까?"
                onConfirm={handleSaveConfirm}
                onCancel={handleSaveCancel}
                type={MODAL_TYPES.CONFIRM_CANCEL}
                confirmText="저장"
                cancelText="취소"
            />

            {/* 저장 완료 모달 */}
            <ConfirmModal
                open={isCompleteModalOpen}
                title="자녀 정보 저장 완료"
                message="자녀 정보가 성공적으로 저장되었습니다."
                onConfirm={handleCompleteModalClose}
                onCancel={handleCompleteModalClose}
                type={MODAL_TYPES.CONFIRM_ONLY}
                confirmText="확인"
            />
        </>
    );
};

export default ChildManagement;