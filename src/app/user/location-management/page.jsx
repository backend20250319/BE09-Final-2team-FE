"use client";

import React, { useState, useRef, useEffect } from 'react';
import Sidebar from "@/components/common/Sidebar";
import './location-management.css';
import ConfirmModal, {MODAL_TYPES} from "@/components/common/ConfirmModal";

// 상수로 분리된 거래지역 목록
const AVAILABLE_AREAS = ['서초동', '양재동', '신사동', '역삼동', '논현동'];

const TradingAreaManagement = () => {
    console.log('🔄 TradingAreaManagement 렌더링');

    const [selectedAreas, setSelectedAreas] = useState([]);
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showLimitAlert, setShowLimitAlert] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    // 초기 상태를 저장할 useRef (변경사항 감지용)
    const initialAreas = useRef([]);

    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    // 컴포넌트 마운트 시 초기 상태 저장
    useEffect(() => {
        initialAreas.current = [...selectedAreas];
    }, []);

    // 외부 클릭 감지 (드롭다운 닫기)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isDropdownOpen &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                searchInputRef.current &&
                !searchInputRef.current.contains(event.target)
            ) {
                closeDropdown();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleInputChange = (e) => {
        console.log('Input:', e.target.value);
        setSearchKeyword(e.target.value);
    };

    // 드롭다운 닫기 및 초기화
    const closeDropdown = () => {
        setIsDropdownOpen(false);
        setIsSearchMode(false);
        setSearchKeyword('');
        if (searchInputRef.current) {
            searchInputRef.current.value = '';
        }
    };

    const handleAreaSelect = (area) => {
        // 3개 제한 체크
        if (selectedAreas.length >= 3) {
            setShowLimitAlert(true);
            setTimeout(() => setShowLimitAlert(false), 5000);
            return;
        }

        // 중복 체크 후 추가
        if (!selectedAreas.includes(area)) {
            setSelectedAreas([...selectedAreas, area]);
        }

        closeDropdown();
    };

    const handleRemoveArea = (index) => {
        const newAreas = selectedAreas.filter((_, i) => i !== index);
        setSelectedAreas(newAreas);
        setShowLimitAlert(false);
    };

    const handleSave = () => {
        console.log('저장된 거래지역:', selectedAreas);
        // 저장 후 초기 상태 업데이트
        initialAreas.current = [...selectedAreas];
        setIsConfirmModalOpen(true);
    };

    const handleCloseModal = () => setIsConfirmModalOpen(false);

    // 변경사항 있는지 확인
    const hasChanges = JSON.stringify(selectedAreas) !== JSON.stringify(initialAreas.current);

    // 필터링된 지역들
    const filteredAreas = searchKeyword === ''
        ? AVAILABLE_AREAS
        : AVAILABLE_AREAS.filter(area => area.includes(searchKeyword));

    return (
        <>
            <Sidebar
                title="거래지역 관리"
                trigger={<button>거래지역 관리</button>}
                onBack={true}
                children={
                    <div className="trading-area-container">
                        <div className="top-group">
                            <p className="info-text">거래지역은 최대 3개까지 선택가능합니다.</p>

                            <div className="search-section">
                                <div className="search-input-container">
                                    {!isSearchMode ? (
                                        <div
                                            ref={searchInputRef}
                                            className="fake-input"
                                            onClick={() => {
                                                console.log('검색 모드 활성화');
                                                setIsSearchMode(true);
                                                setIsDropdownOpen(true);
                                            }}
                                            tabIndex={0}
                                            role="button"
                                            aria-haspopup="true"
                                            aria-expanded={isDropdownOpen}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    setIsSearchMode(true);
                                                    setIsDropdownOpen(true);
                                                }
                                            }}
                                        >
                                            <span className="placeholder-left">주소를 검색하세요</span>
                                            <span className="placeholder-right">예: 서초동, 강남구, 마포구 등</span>
                                        </div>
                                    ) : (
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            className="real-input"
                                            onChange={handleInputChange}
                                            placeholder="지역명을 입력하세요..."
                                            autoFocus
                                        />
                                    )}

                                    {/* 드롭다운 결과 */}
                                    {isDropdownOpen && (
                                        <div
                                            ref={dropdownRef}
                                            className="search-dropdown"
                                            role="listbox"
                                            aria-label="거래지역 목록"
                                        >
                                            <div className="dropdown-content">
                                                <div className="dropdown-results">
                                                    {filteredAreas.map(area => (
                                                        <div
                                                            key={area}
                                                            className="dropdown-item"
                                                            role="option"
                                                            aria-selected="false"
                                                            onClick={() => handleAreaSelect(area)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter' || e.key === ' ') {
                                                                    e.preventDefault();
                                                                    handleAreaSelect(area);
                                                                }
                                                            }}
                                                            tabIndex={-1}
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
                }
            />

            {/* 확인 모달 */}
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