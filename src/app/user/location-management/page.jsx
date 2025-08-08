"use client";

import React, { useState, useRef, useEffect } from 'react';
import Sidebar from "@/components/common/Sidebar";
import './location-management.css';
import ConfirmModal, {MODAL_TYPES} from "@/components/common/ConfirmModal";

const TradingAreaManagement = () => {
    const [selectedAreas, setSelectedAreas] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showLimitAlert, setShowLimitAlert] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    // 1. 초기 상태를 저장할 useRef
    const initialAreas = useRef([]);

    // 드롭다운 영역 참조를 위한 ref
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    // 모달을 닫는 함수
    const handleCloseModal = () => setIsConfirmModalOpen(false);

    // 2. 컴포넌트가 처음 마운트될 때만 실행되어 초기 상태를 저장하는 useEffect
    useEffect(() => {
        // 실제로는 API에서 초기 데이터를 받아와서 설정해야 함
        // 지금은 selectedAreas가 처음에는 비어있다고 가정
        initialAreas.current = [...selectedAreas];
    }, []);

    // 3. 기존의 외부 클릭 감지 useEffect
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isDropdownOpen &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                searchInputRef.current &&
                !searchInputRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleAreaSelect = (area) => {
        // 3개 제한 체크
        if (selectedAreas.length >= 3) {
            setShowLimitAlert(true);
            setTimeout(() => setShowLimitAlert(false), 5000);
            setIsDropdownOpen(false);
            return;
        }

        // 중복 체크 후 추가
        if (!selectedAreas.includes(area)) {
            setSelectedAreas([...selectedAreas, area]);
        }
        setIsDropdownOpen(false);
    };

    const handleRemoveArea = (index) => {
        const newAreas = selectedAreas.filter((_, i) => i !== index);
        setSelectedAreas(newAreas);
        setShowLimitAlert(false);
    };

    const handleSave = () => {
        // 실제 저장 로직 실행 (예: API 호출)
        console.log('저장된 거래지역:', selectedAreas);

        // 저장이 성공적으로 완료되면 initialAreas를 현재 상태로 업데이트
        initialAreas.current = [...selectedAreas];

        // 모달 열기
        setIsConfirmModalOpen(true);
    };

    const SidebarContent = () => {
        // 변경사항이 있는지 확인하는 로직
        const hasChanges = JSON.stringify(selectedAreas) !== JSON.stringify(initialAreas.current);

        return (
            <div className="trading-area-container">
                <div className="top-group">
                    <p className="info-text">거래지역은 최대 3개까지 선택가능합니다.</p>

                    <div className="search-section">
                        <div className="search-input-container">
                            <div
                                ref={searchInputRef}
                                className="fake-input"
                                onClick={() => setIsDropdownOpen(true)}
                            >
                                <span className="placeholder-left">주소를 검색하세요</span>
                                <span className="placeholder-right">예: 서초동, 강남구, 마포구 등</span>
                            </div>

                            {isDropdownOpen && (
                                <div ref={dropdownRef} className="search-dropdown">
                                    <div className="dropdown-content">
                                        <div className="dropdown-results">
                                            {['서초동', '양재동', '신사동', '역삼동', '논현동'].map(area => (
                                                <div
                                                    key={area}
                                                    className="dropdown-item"
                                                    onClick={() => handleAreaSelect(area)}
                                                >
                                                    {area}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 3개 제한 알림 */}
                    {showLimitAlert && (
                        <div className="limit-alert">
                            최대 3개 지역이 선택되었습니다. 다른 지역을 선택하려면 기존 지역을 삭제해주세요.
                        </div>
                    )}

                    <div className="selected-areas-section">
                        <div className="selected-areas-header">
                            <span className="selected-areas-title">선택된 거래지역</span>
                            <div className="area-count-badge">
                                <span>{selectedAreas.length}/3</span>
                            </div>
                        </div>

                        <div className="selected-areas-content">
                            {selectedAreas.length === 0 ? (
                                <div className="empty-state">
                                    <p>아직 선택된 거래지역이 없습니다</p>
                                    <p>위에서 지역을 검색해보세요</p>
                                </div>
                            ) : (
                                <div className="areas-list">
                                    {selectedAreas.map((area, index) => (
                                        <div key={index} className="area-item">
                                            <span>{area}</span>
                                            <button
                                                className="remove-area-btn"
                                                onClick={() => handleRemoveArea(index)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bottom-group">
                    <button
                        className={`save-button ${hasChanges ? 'active' : ''}`}
                        onClick={handleSave}
                        disabled={!hasChanges}
                    >
                        거래지역 저장
                    </button>
                </div>
            </div>
        );
    };

    return (
        <>
            <Sidebar
                title="거래지역 관리"
                trigger={<button>거래지역 관리</button>}
                children={<SidebarContent />}
                onBack={true}
                width="max-w-[600px]"
            />
            <ConfirmModal
                open={isConfirmModalOpen}
                title="저장 완료"
                message="거래지역이 성공적으로 저장되었습니다."
                onConfirm={handleCloseModal}
                onCancel={handleCloseModal}
                type={MODAL_TYPES.CONFIRM_ONLY}
            />
        </>
    );
};

export default TradingAreaManagement;