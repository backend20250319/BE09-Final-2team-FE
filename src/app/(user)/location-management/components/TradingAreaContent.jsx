"use client";

import React, { useState, useRef, useEffect } from 'react';
import '../location-management.css';
import ConfirmModal, {MODAL_TYPES} from "@/components/common/ConfirmModal";

const AVAILABLE_AREAS = ['서초동', '양재동', '신사동', '역삼동', '논현동', '강남동', '청담동', '압구정동', '도곡동', '개포동'];

const TradingAreaContent = () => {
    // sessionStorage에서 초기값 불러오기 (SSR 안전 처리)
    const [selectedAreas, setSelectedAreas] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = sessionStorage.getItem('selectedAreas');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    const [isSearchMode, setIsSearchMode] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showLimitAlert, setShowLimitAlert] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const initialAreas = useRef([]);
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);
    const dropdownItemRefs = useRef([]);

    // sessionStorage에 저장하는 useEffect 추가
    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('selectedAreas', JSON.stringify(selectedAreas));
        }
    }, [selectedAreas]);

    useEffect(() => {
        // sessionStorage에서 불러온 데이터를 초기값으로 설정
        if (typeof window !== 'undefined') {
            const saved = sessionStorage.getItem('selectedAreas');
            if (saved) {
                const savedAreas = JSON.parse(saved);
                initialAreas.current = [...savedAreas];
            } else {
                initialAreas.current = [...selectedAreas];
            }
        } else {
            initialAreas.current = [...selectedAreas];
        }
    }, []);

    // 외부 클릭 감지
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

    // 드롭다운이 열릴 때마다 포커스 인덱스 초기화
    useEffect(() => {
        if (isDropdownOpen) {
            setFocusedIndex(-1);
        }
    }, [isDropdownOpen]);

    // 포커스된 항목을 화면에 보이도록 스크롤 처리
    useEffect(() => {
        if (focusedIndex >= 0 && dropdownItemRefs.current[focusedIndex]) {
            const focusedElement = dropdownItemRefs.current[focusedIndex];
            const dropdown = dropdownRef.current;

            if (dropdown && focusedElement) {
                const dropdownRect = dropdown.getBoundingClientRect();
                const elementRect = focusedElement.getBoundingClientRect();

                // 요소가 드롭다운 영역을 벗어났는지 확인
                if (elementRect.bottom > dropdownRect.bottom) {
                    // 아래로 스크롤
                    focusedElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'nearest'
                    });
                } else if (elementRect.top < dropdownRect.top) {
                    // 위로 스크롤
                    focusedElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'nearest'
                    });
                }
            }
        }
    }, [focusedIndex]);

    const handleInputChange = (e) => {
        setSearchKeyword(e.target.value);
        setFocusedIndex(-1); // 검색어 변경 시 포커스 초기화
    };

    // 키보드 네비게이션 처리
    const handleInputKeyDown = (e) => {
        const filteredAreas = searchKeyword === ''
            ? AVAILABLE_AREAS
            : AVAILABLE_AREAS.filter(area => area.includes(searchKeyword));

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                // 끝에서 멈추도록 변경
                const nextIndex = focusedIndex < filteredAreas.length - 1 ? focusedIndex + 1 : focusedIndex;
                setFocusedIndex(nextIndex);
                break;
            case 'ArrowUp':
                e.preventDefault();
                // 처음에서 멈추도록 변경
                const prevIndex = focusedIndex > 0 ? focusedIndex - 1 : focusedIndex;
                setFocusedIndex(prevIndex);
                break;
            case 'Enter':
                e.preventDefault();
                if (focusedIndex >= 0 && focusedIndex < filteredAreas.length) {
                    handleAreaSelect(filteredAreas[focusedIndex]);
                } else if (filteredAreas.length > 0) {
                    handleAreaSelect(filteredAreas[0]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                closeDropdown();
                break;
        }
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
        setIsSearchMode(false);
        setSearchKeyword('');
        setFocusedIndex(-1);
        if (searchInputRef.current) {
            searchInputRef.current.value = '';
        }
    };

    const handleAreaSelect = (area) => {
        if (selectedAreas.length >= 3) {
            setShowLimitAlert(true);
            setTimeout(() => setShowLimitAlert(false), 5000);
            return;
        }

        if (!selectedAreas.includes(area)) {
            setSelectedAreas([...selectedAreas, area]);
        }

        setTimeout(() => {
            // 검색 input 포커스 제거
            if (searchInputRef.current) {
                searchInputRef.current.blur();
            }
            // 현재 포커스된 모든 요소 제거
            if (document.activeElement) {
                document.activeElement.blur();
            }
            // body로 포커스 이동
            document.body.focus();
        }, 0);

        closeDropdown();
    };

    const handleRemoveArea = (index) => {
        const newAreas = selectedAreas.filter((_, i) => i !== index);
        setSelectedAreas(newAreas);
        setShowLimitAlert(false);
    };

    const handleSave = () => {
        console.log('저장된 거래지역:', selectedAreas);
        // sessionStorage에도 명시적으로 저장 (이미 useEffect에서 저장되지만 확실히 하기 위해)
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('selectedAreas', JSON.stringify(selectedAreas));
        }
        initialAreas.current = [...selectedAreas];
        setIsConfirmModalOpen(true);
    };

    const handleCloseModal = () => setIsConfirmModalOpen(false);
    const hasChanges = JSON.stringify(selectedAreas) !== JSON.stringify(initialAreas.current);

    // 필터링된 지역 목록
    const filteredAreas = searchKeyword === ''
        ? AVAILABLE_AREAS
        : AVAILABLE_AREAS.filter(area => area.includes(searchKeyword));

    return (
        <>
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
                                    onKeyDown={handleInputKeyDown}
                                    placeholder="지역명을 입력하세요..."
                                    autoFocus
                                    aria-describedby="search-instructions"
                                    aria-activedescendant={
                                        focusedIndex >= 0 ? `area-option-${focusedIndex}` : undefined
                                    }
                                />
                            )}

                            {/* 숨겨진 사용법 안내 */}
                            <div id="search-instructions" className="sr-only">
                                방향키로 항목을 선택하고 Enter키로 확정하세요. Escape키로 닫을 수 있습니다.
                            </div>

                            {isDropdownOpen && (
                                <div
                                    ref={dropdownRef}
                                    className="search-dropdown"
                                    role="listbox"
                                    aria-label="거래지역 목록"
                                    style={{
                                        maxHeight: '200px',
                                        overflowY: 'auto'
                                    }}
                                >
                                    <div className="dropdown-content">
                                        <div className="dropdown-results">
                                            {filteredAreas.length === 0 ? (
                                                <div className="dropdown-item no-results">
                                                    검색 결과가 없습니다
                                                </div>
                                            ) : (
                                                filteredAreas.map((area, index) => (
                                                    <div
                                                        key={area}
                                                        id={`area-option-${index}`}
                                                        ref={el => dropdownItemRefs.current[index] = el}
                                                        className={`dropdown-item ${
                                                            index === focusedIndex ? 'focused' : ''
                                                        }`}
                                                        role="option"
                                                        aria-selected={index === focusedIndex}
                                                        onClick={() => handleAreaSelect(area)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' || e.key === ' ') {
                                                                e.preventDefault();
                                                                handleAreaSelect(area);
                                                            }
                                                        }}
                                                        onMouseEnter={() => setFocusedIndex(index)}
                                                        onMouseLeave={() => setFocusedIndex(-1)}
                                                        tabIndex={-1}
                                                        style={{
                                                            backgroundColor: index === focusedIndex ? '#E3F2FD' : 'white',
                                                            color: index === focusedIndex ? '#1976D2' : 'inherit',
                                                            fontWeight: index === focusedIndex ? '500' : 'normal',
                                                            padding: '12px 16px',
                                                            cursor: 'pointer',
                                                            borderBottom: '1px solid #f0f0f0'
                                                        }}
                                                    >
                                                        {area}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

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
                                                aria-label={`${area} 삭제`}
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

export default TradingAreaContent;