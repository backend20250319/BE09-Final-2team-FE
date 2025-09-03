'use client';

import React, { useState, useEffect, useRef } from 'react';
import { productAPI } from '@/lib/api';
import { X } from 'lucide-react';
import './AddressSearch.css';

// TODO 지역 검색 API 손봐야함 > 구의동 검색시 오류
const AddressSearch = ({ onChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // 선택된 주소
    const [selectedAddresses, setSelectedAddresses] = useState([]);

    const [showWarning, setShowWarning] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [searchResults, setSearchResults] = useState([]);
    const dropdownRef = useRef(null);

    // ✅ 검색어 변경 시 API 호출
    useEffect(() => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }

        const fetchAreas = async () => {
            try {
                const { data } = await productAPI.searchAreas(searchTerm);
                if (data.success) {
                    setSearchResults(data.data);
                    setIsDropdownOpen(true);
                }
            } catch (err) {
                console.error('주소 검색 실패:', err);
                setSearchResults([]);
            }
        };

        const debounceTimer = setTimeout(fetchAreas, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    // 검색어 하이라이트 함수 (fullName 기준)
    const highlightSearchTerm = (text, searchTerm) => {
        if (!searchTerm) return text;

        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, index) =>
            regex.test(part) ? (
                <span key={index} style={{ color: '#FF501B' }}>
                    {part}
                </span>
            ) : (
                part
            )
        );
    };

    // 드롭다운 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
                setHighlightedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 검색어 변경 시 하이라이트 인덱스 초기화
    useEffect(() => {
        setHighlightedIndex(-1);
    }, [searchTerm]);

    // ✅ 주소 선택 (id + fullName 저장)
    const handleAddressSelect = (address) => {
        if (selectedAddresses.length >= 3) {
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 3000);
            return;
        }

        if (!selectedAddresses.find((a) => a.id === address.id)) {
            const updated = [...selectedAddresses, address];
            setSelectedAddresses(updated);
            onChange?.(updated);

            console.log('✅ 현재 선택된 주소 리스트:', updated); // 👈 여기!
        }
        setSearchTerm('');
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
    };

    // 주소 제거
    const handleAddressRemove = (id) => {
        const updated = selectedAddresses.filter((address) => address.id !== id);
        setSelectedAddresses(updated);
        onChange?.(updated);
    };

    // 검색어 변경
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setIsDropdownOpen(value.length > 0);
    };

    // 키보드 네비게이션 처리
    const handleKeyDown = (e) => {
        if (!isDropdownOpen || searchResults.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < searchResults.length) {
                    handleAddressSelect(searchResults[highlightedIndex]);
                } else if (searchResults.length > 0) {
                    handleAddressSelect(searchResults[0]);
                }
                break;
            case 'Escape':
                setIsDropdownOpen(false);
                setHighlightedIndex(-1);
                break;
        }
    };

    return (
        <div className='product-address-search-container'>
            {/* 주소 검색 입력창 */}
            <div className='product-address-search-input-container'>
                <input
                    type='text'
                    className='product-address-search-input'
                    placeholder='주소를 검색하세요 (예: 서초동, 강남구, 마포구 등)'
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsDropdownOpen(searchTerm.length > 0)}
                />
            </div>

            {/* 경고 문구 */}
            {showWarning && <div className='product-address-warning'>주소는 최대 3개까지만 선택할 수 있습니다.</div>}

            {/* 선택된 주소 태그들 */}
            {selectedAddresses.length > 0 && (
                <div className='product-selected-addresses-container'>
                    <div className='product-selected-addresses-list'>
                        {selectedAddresses.map((address) => (
                            <div key={address.id} className='product-address-tag'>
                                <span className='product-address-text'>{address.fullName}</span>
                                <button
                                    className='product-remove-button'
                                    onClick={() => handleAddressRemove(address.id)}
                                    type='button'
                                    aria-label={`${address.fullName} 제거`}
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 검색 결과 드롭다운 */}
            {isDropdownOpen && (
                <div className='product-address-dropdown' ref={dropdownRef}>
                    {searchResults.length > 0 ? (
                        searchResults.map((address, index) => (
                            <div
                                key={address.id}
                                className={`product-address-dropdown-item ${
                                    index === highlightedIndex ? 'product-address-dropdown-item-highlighted' : ''
                                }`}
                                onClick={() => handleAddressSelect(address)}
                                onMouseEnter={() => setHighlightedIndex(index)}
                                role='option'
                                aria-selected={index === highlightedIndex}
                            >
                                {highlightSearchTerm(address.fullName, searchTerm)}
                            </div>
                        ))
                    ) : (
                        <div className='product-address-dropdown-no-results'>검색 결과가 없습니다</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AddressSearch;
