'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import './AddressSearch.css';

const AddressSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedAddresses, setSelectedAddresses] = useState([]);
    const [showWarning, setShowWarning] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const dropdownRef = useRef(null);

    // 가짜 동네 데이터
    const fakeAddressData = [
        '서울 서초구 서초1동',
        '서울 서초구 서초2동',
        '서울 서초구 서초3동',
        '서울 서초구 서초4동',
        '서울 강남구 역삼1동',
        '서울 강남구 역삼2동',
        '서울 마포구 합정동',
        '서울 마포구 망원동',
        '서울 마포구 상암동',
        '서울 송파구 잠실동',
        '서울 송파구 문정동',
        '서울 송파구 가락동',
        '서울 동작구 사당동',
    ];

    // 검색어에 따른 필터링된 결과
    const filteredAddresses = fakeAddressData.filter((address) =>
        address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 검색어 하이라이트 함수
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

    // 주소 선택
    const handleAddressSelect = (address) => {
        // 최대 3개까지만 선택 가능
        if (selectedAddresses.length >= 3) {
            setShowWarning(true);
            // 3초 후 경고 문구 숨기기
            setTimeout(() => setShowWarning(false), 3000);
            return;
        }

        // 주소에서 "동"까지만 추출 (예: "서울 서초구 서초1동" → "서초1동")
        const dongPart = address.split(' ').pop(); // 마지막 부분 (동)

        if (!selectedAddresses.includes(dongPart)) {
            setSelectedAddresses([...selectedAddresses, dongPart]);
        }
        setSearchTerm('');
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
    };

    // 주소 제거
    const handleAddressRemove = (addressToRemove) => {
        const updatedAddresses = selectedAddresses.filter((address) => address !== addressToRemove);
        setSelectedAddresses(updatedAddresses);
    };

    // 검색어 변경
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setIsDropdownOpen(value.length > 0);
    };

    // 키보드 네비게이션 처리
    const handleKeyDown = (e) => {
        if (!isDropdownOpen || filteredAddresses.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex((prev) => {
                    if (prev === -1) return 0; // 첫 번째 항목부터 시작
                    return prev < filteredAddresses.length - 1 ? prev + 1 : 0;
                });
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex((prev) => {
                    if (prev === -1) return filteredAddresses.length - 1; // 마지막 항목부터 시작
                    return prev > 0 ? prev - 1 : filteredAddresses.length - 1;
                });
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < filteredAddresses.length) {
                    handleAddressSelect(filteredAddresses[highlightedIndex]);
                    setIsDropdownOpen(false);
                    setHighlightedIndex(-1);
                } else if (filteredAddresses.length > 0) {
                    handleAddressSelect(filteredAddresses[0]);
                    setIsDropdownOpen(false);
                    setHighlightedIndex(-1);
                }
                break;
            case 'Escape':
                setIsDropdownOpen(false);
                setHighlightedIndex(-1);
                break;
        }
    };

    // Enter 키 처리 (기존 함수 제거하고 handleKeyDown으로 통합)
    const handleKeyPress = (e) => {
        // Enter 키는 handleKeyDown에서 처리하므로 여기서는 아무것도 하지 않음
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
            {/* <div className='product-address-warning'>주소는 최대 3개까지만 선택할 수 있습니다.</div> */}

            {/* 선택된 주소 태그들 */}
            {selectedAddresses.length > 0 && (
                <div className='product-selected-addresses-container'>
                    <div className='product-selected-addresses-list'>
                        {selectedAddresses.map((address, index) => (
                            <div key={index} className='product-address-tag'>
                                <span className='product-address-text'>{address}</span>
                                <button
                                    className='product-remove-button'
                                    onClick={() => handleAddressRemove(address)}
                                    type='button'
                                    aria-label={`${address} 제거`}
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
                    {filteredAddresses.length > 0 ? (
                        filteredAddresses.map((address, index) => (
                            <div
                                key={index}
                                className={`product-address-dropdown-item ${
                                    index === highlightedIndex ? 'product-address-dropdown-item-highlighted' : ''
                                }`}
                                onClick={() => handleAddressSelect(address)}
                                onMouseEnter={() => setHighlightedIndex(index)}
                                role='option'
                                aria-selected={index === highlightedIndex}
                            >
                                {highlightSearchTerm(address, searchTerm)}
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
