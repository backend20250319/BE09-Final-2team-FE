'use client';

import React, { useState, useEffect } from 'react';
import { productAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/common/ProductCard';
import Sidebar from '@/components/common/Sidebar';
import { useSidebarStore } from '@/store/sidebarStore';
import '@/common-css/WishlistSidebar.css';

const WishlistSidebar = ({ trigger }) => {
    const [wishlistProducts, setWishlistProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState(wishlistProducts);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const router = useRouter();
    const closeSidebar = useSidebarStore((state) => state.closeAll);
    const isOpen = useSidebarStore((state) => state.isOpen('wishlist')(state));

    /**x
     * 백엔드 API에서 위시리스트 데이터를 가져오는 함수
     * 컴포넌트 마운트 시 자동으로 호출됨
     */
    const fetchWishlistProducts = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const { data } = await productAPI.getMyWishlist();

            if (data.success) {
                // 변환 없이 그대로 넣기
                setWishlistProducts(data.data);
                setFilteredProducts(data.data);
            } else {
                throw new Error(data.message || '찜목록 조회 실패');
            }
        } catch (err) {
            console.error('위시리스트 로딩 에러:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * 컴포넌트 마운트 시 데이터 로드
     * 빈 배열 []을 의존성으로 사용하여 마운트 시에만 실행
     */
    React.useEffect(() => {
        if (isOpen) {
            fetchWishlistProducts();
        }
    }, [isOpen]);

    /**
     * 검색어에 따라 상품 목록을 필터링하는 함수
     * @param {string} searchTerm - 검색어
     */
    const handleSearch = (searchTerm) => {
        if (!searchTerm.trim()) {
            setFilteredProducts(wishlistProducts);
        } else {
            const filtered = wishlistProducts.filter(
                (product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()) // ✅ name으로 검색
            );
            setFilteredProducts(filtered);
        }
    };

    /**
     * 검색어를 초기화하고 모든 상품을 다시 표시하는 함수
     */
    const handleClear = () => {
        setFilteredProducts(wishlistProducts);
        setSearchTerm('');
    };

    /**
     * 검색 입력창의 값이 변경될 때 호출되는 함수
     * 실시간으로 검색 결과를 업데이트
     * @param {Event} e - 입력 이벤트
     */
    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        // 검색어가 비어있으면 모든 상품 표시
        if (value.trim() === '') {
            setFilteredProducts(wishlistProducts);
        }
    };

    /**
     * 검색 입력창에 포커스가 들어올 때 호출되는 함수
     * 입력창 스타일 변경을 위해 사용
     */
    const handleFocus = () => {
        setIsFocused(true);
    };

    /**
     * 검색 입력창에서 포커스가 나갈 때 호출되는 함수
     * 입력창 스타일 변경을 위해 사용
     */
    const handleBlur = () => {
        setIsFocused(false);
    };

    /**
     * 검색 입력창에서 Enter 키를 눌렀을 때 호출되는 함수
     * 검색 실행을 위해 사용
     * @param {KeyboardEvent} e - 키보드 이벤트
     */
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            const searchValue = e.target.value.trim();
            if (searchValue === '') {
                // 검색어가 없으면 모든 상품 표시
                setFilteredProducts(wishlistProducts);
            } else {
                // 검색어가 있으면 필터링
                handleSearch(searchValue);
            }
        }
    };

    /**
     * wishlistProducts가 변경될 때 filteredProducts를 동기화하는 함수
     * 상품이 추가/제거될 때 검색 결과도 함께 업데이트
     */
    useEffect(() => {
        if (isOpen) {
            fetchWishlistProducts();
        }
    }, [isOpen]);

    /**
     * 위시리스트에서 상품을 제거하는 함수
     * API 호출 후 로컬 상태에서도 제거
     * @param {number} productId - 제거할 상품의 ID
     */
    const handleRemoveFromWishlist = async (productId) => {
        try {
            // // TODO: 실제 API 엔드포인트로 교체
            // const response = await fetch(`/api/wishlist/${productId}`, {
            //     method: 'DELETE',
            // });

            // if (!response.ok) {
            //     throw new Error('상품 제거에 실패했습니다.');
            // }

            // 로컬 상태에서 제거
            const updatedProducts = wishlistProducts.filter((product) => product.id !== productId);
            setWishlistProducts(updatedProducts);
            setFilteredProducts(updatedProducts);
        } catch (err) {
            console.error('상품 제거 에러:', err);
            // 에러 처리 (예: 토스트 메시지)
        }
    };

    /**
     * 상품 카드를 클릭했을 때 호출되는 함수
     * 상품 상세 페이지로 이동하는 로직을 처리
     * @param {Object} product - 클릭된 상품 정보
     */
    const handleProductClick = (product) => {
        // 사이드바 닫기
        closeSidebar(trigger);
        // 상품 상세 페이지로 이동
        router.push(`/product/${product.id}`);
    };

    const wishlistContent = (
        <div className='wishlist-container'>
            {/* 검색 섹션 - 상단에 독립적으로 배치 */}
            <div className='wishlist-search-section'>
                <div className={`wishlist-search-container ${isFocused ? 'focused' : ''}`}>
                    <div className='wishlist-search-icon'>
                        <svg viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
                            <circle cx='9' cy='9' r='6' />
                            <path d='M14 14L17 17' />
                        </svg>
                    </div>

                    <input
                        type='text'
                        className='wishlist-search-input'
                        placeholder='찜한 상품 검색'
                        value={searchTerm}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                    />

                    {searchTerm && (
                        <button className='clear-button' onClick={handleClear} type='button' aria-label='검색어 지우기'>
                            <svg viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'>
                                <path d='M12 4L4 12M4 4L12 12' />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* 상품 목록 섹션 */}
            <div className='wishlist-product-container'>
                {isLoading ? (
                    <div className='wishlist-loading'>
                        <p>로딩 중...</p>
                    </div>
                ) : error ? (
                    <div className='wishlist-error'>
                        <p>{error}</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className='wishlist-empty'>
                        <p>{wishlistProducts.length === 0 ? '찜한 상품이 없습니다.' : '검색 결과가 없습니다.'}</p>
                    </div>
                ) : (
                    filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            variant='wishlist'
                            onRemoveFromWishlist={(id) => {
                                setWishlistProducts((prev) => prev.filter((p) => p.id !== id));
                                setFilteredProducts((prev) => prev.filter((p) => p.id !== id));
                            }}
                        />
                    ))
                )}
            </div>
        </div>
    );

    return (
        <Sidebar
            sidebarKey='wishlist' // 마이페이지 연동을 위해 추가
            title='찜한 상품'
            trigger={trigger}
            onBack={true} // 뒤로 가기 버튼 추가
        >
            <div className='wishlist-sidebar'>{wishlistContent}</div>
        </Sidebar>
    );
};

export default WishlistSidebar;
