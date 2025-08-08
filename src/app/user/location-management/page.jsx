"use client";

import React, { useState, useRef, useEffect } from 'react';
import Sidebar from "@/components/common/Sidebar";
import './location-management.css';
import ConfirmModal, {MODAL_TYPES} from "@/components/common/ConfirmModal";

const TradingAreaManagement = () => {
    const [selectedAreas, setSelectedAreas] = useState([]);
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
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

    // 드롭다운 닫기 및 초기화 함수
    const closeDropdown = () => {
        setIsDropdownOpen(false);
        setIsSearchMode(false);  // 검색 모드 초기화
        setSearchKeyword('');    // 검색어 초기화
    };

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
                closeDropdown(); // setIsDropdownOpen(false) 대신 closeDropdown 사용
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleSearch = (e) => {
        setSearchKeyword(e.target.value);
        // 나중에 api 호출 로직 추가
    }

    const handleAreaSelect = (area) => {
        // 3개 제한 체크
        if (selectedAreas.length >= 3) {
            setShowLimitAlert(true);
            setTimeout(() => setShowLimitAlert(false), 5000);
            closeDropdown(); // setIsDropdownOpen(false) 대신 closeDropdown 사용
            return;
        }

        // 중복 체크 후 추가
        if (!selectedAreas.includes(area)) {
            setSelectedAreas([...selectedAreas, area]);
        }
        closeDropdown(); // setIsDropdownOpen(false) 대신 closeDropdown 사용
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
                            {!isSearchMode ? (
                                <div
                                    ref={searchInputRef}
                                    className="fake-input"
                                    onClick={() => {
                                        setIsDropdownOpen(true);
                                        setIsSearchMode(true);
                                    }}
                                    tabIndex={0} // 키보드 tab 으로 포커스 가능
                                    role="button" // 스크린 리더가 'button' 으로 인식, 현재 클릭만 하는 트리거라 button 사용
                                    aria-haspopup="true" // 팝업이 있다고 알림
                                    aria-expanded={isDropdownOpen} // 현재 열림, 닫힘 상태 알림
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            setIsDropdownOpen(true);
                                            setIsSearchMode(true);
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
                                    value={searchKeyword}
                                    onChange={handleSearch}
                                    onKeyUp={handleSearch}
                                    placeholder="지역명을 입력하세요..."
                                    autoFocus
                                />
                            )}

                            {isDropdownOpen && (
                                <div
                                    ref={dropdownRef}
                                    className="search-dropdown"
                                    role="listbox" // 선택 가능한 옵션들의 리스트
                                    aria-label="거래지역 목록" // 스크린 리더용 설명
                                >
                                    <div className="dropdown-content">
                                        <div className="dropdown-results">
                                            {['서초동', '양재동', '신사동', '역삼동', '논현동']
                                                .filter(area =>
                                                    searchKeyword === '' || area.includes(searchKeyword)
                                                )
                                                .map(area => (
                                                    <div
                                                        key={area}
                                                        className="dropdown-item"
                                                        role="option" // 각 항목이  선택 옵션임을 표시
                                                        aria-selected="false" // 현재 선택 상태 (나중에 동적으로 변경)
                                                        onClick={() => handleAreaSelect(area)}
                                                        onKeyDown={(e) => { // 키모드 접근성
                                                            if (e.key === 'Enter' || e.key === ' ') {
                                                                e.preventDefault();
                                                                handleAreaSelect(area);
                                                            }
                                                        }}
                                                        tabIndex={-1} // 포커스는 받되, tab 순서에서 제외
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