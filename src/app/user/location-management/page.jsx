"use client";

import React, { useState } from 'react';
import Sidebar from "@/components/common/Sidebar";
import './location-management.css';

const TradingAreaManagement = () => {
    const [searchValue, setSearchValue] = useState('');
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [selectedAreas, setSelectedAreas] = useState([]);

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handleSave = () => {
        if (searchValue.trim() && selectedAreas.length < 3) {
            setSelectedAreas([...selectedAreas, searchValue.trim()]);
            setSearchValue('');
            setIsSearchActive(false); // 저장 후 검색창 비활성화
        }
    };

    const handleRemoveArea = (index) => {
        const newAreas = selectedAreas.filter((_, i) => i !== index);
        setSelectedAreas(newAreas);
    };

    const SidebarContent = () => (
        <div className="trading-area-container">
            <div className="top-group">
                <p className="info-text">거래지역은 최대 3개까지 선택가능합니다.</p>

                <div className="search-section">
                    <div className="search-input-container">
                        {!isSearchActive ? (
                            <div className="fake-input" onClick={() => setIsSearchActive(true)}>
                                <span className="placeholder-left">주소를 검색하세요</span>
                                <span className="placeholder-right">예: 서초동, 강남구, 마포구 등</span>
                            </div>
                        ) : (
                            <input
                                type="text"
                                className="real-input"
                                value={searchValue}
                                onChange={handleSearchChange}
                                onBlur={() => {
                                    if (!searchValue.trim()) {
                                        setIsSearchActive(false);
                                    }
                                }}
                                placeholder="주소를 검색하세요"
                                autoFocus
                            />
                        )}
                    </div>
                </div>

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
                    className={`save-button ${selectedAreas.length > 0 ? 'active' : ''}`}
                    onClick={handleSave}
                    disabled={selectedAreas.length === 0}
                >
                    거래지역 저장
                </button>
            </div>
        </div>
    );

    return (
        <Sidebar
            title="거래지역 관리"
            trigger={<button>거래지역 관리</button>}
            children={<SidebarContent />}
            onBack={true}
            width="max-w-[600px]"
        />
    );
};

export default TradingAreaManagement;