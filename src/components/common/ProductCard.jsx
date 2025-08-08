'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/common-css/ProductCard.css';

const CARD_SIZES = {
    size0: 132,
    size1: 157,
    size2: 181,
    size3: 235,
};

const ProductCard = ({ product, onReviewClick, size, variant = 'normal', onRemoveFromWishlist, onProductClick }) => {
    const {
        id,
        productName,
        price,
        location,
        timeAgo,
        imageUrl,
        trade_status,
        status,
        hasWrittenReview,
        showReviewButton,
    } = product;
    const [isWishlisted, setIsWishlisted] = useState(false);
    const cardWidth = CARD_SIZES[size] || CARD_SIZES.size1;
    const router = useRouter();

    // trade_status 영어값을 한글로 변환
    const getTradeStatusText = (status) => {
        switch (status) {
            case 'ON_SALE':
                return '판매중';
            case 'RESERVED':
                return '예약중';
            case 'ON_HOLD':
                return '판매보류';
            case 'SOLD':
                return '판매완료';
            default:
                return '판매중';
        }
    };

    // status 영어값을 한글로 변환
    const getStatusText = (status) => {
        switch (status) {
            case 'NEW':
                return '새상품';
            case 'USED':
                return '중고';
            default:
                return '중고';
        }
    };

    const tradeStatusText = getTradeStatusText(trade_status);
    const statusText = getStatusText(status);

    const handleWishlistClick = () => {
        setIsWishlisted((prev) => !prev);
    };

    const handleRemoveFromWishlist = (e) => {
        e.stopPropagation(); // 상품 클릭 이벤트와 분리
        if (onRemoveFromWishlist) {
            onRemoveFromWishlist(product.id);
        }
    };

    const handleProductClick = () => {
        if (onProductClick) {
            onProductClick(product);
        } else {
            // 기본 동작: 상품 상세 페이지로 이동
            router.push(`/product/${id}`);
        }
    };

    const handleReviewClick = () => {
        if (onReviewClick) {
            onReviewClick();
        }
    };

    // wishlist 모드일 때의 렌더링
    if (variant === 'wishlist') {
        return (
            <div className='wishlist-product-card' onClick={handleProductClick} style={{ cursor: 'pointer' }}>
                {/* 이미지 영역 */}
                <div className='product-image-container'>
                    <img
                        src={imageUrl || 'https://via.placeholder.com/176x176/E3E3E3/999999?text=상품이미지'}
                        alt={`${productName} 이미지`}
                        className='product-image'
                    />

                    {/* 상품 상태 오버레이 (판매보류, 판매완료, 예약중 등) */}
                    {trade_status !== 'ON_SALE' && (
                        <div className='product-status-overlay'>
                            <span className='product-status-text'>{tradeStatusText}</span>
                        </div>
                    )}

                    {/* 찜하기 버튼 */}
                    <div
                        className='wishlist-button active'
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFromWishlist(e);
                        }}
                        title='찜한 상품에서 제거'
                    >
                        <img src='/images/product/wishlist-on.svg' alt='찜하기됨' width={24} height={24} />
                    </div>
                </div>

                {/* 상품 정보 */}
                <div className='product-info'>
                    <div className='product-details'>
                        <h3 className='product-name' title={productName}>
                            {productName}
                        </h3>
                        <div className='product-price'>
                            <span className='price'>{price}</span>
                        </div>
                        <div className='product-location'>
                            <span className='location-time'>
                                {location} | {timeAgo}
                            </span>
                        </div>
                        <div className='product-tags'>
                            <span className={`tag ${status === 'NEW' ? 'new-product' : 'used-product'}`}>
                                {statusText}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='product-card-wrapper'>
            <div
                className={`product-card-container${trade_status !== 'ON_SALE' ? ' statused' : ''}`}
                style={{ width: cardWidth, cursor: 'pointer' }}
                onClick={handleProductClick}
            >
                <div className='product-card-image-container' style={{ width: cardWidth, height: cardWidth }}>
                    <img
                        src={imageUrl}
                        alt={`${productName} 이미지`}
                        className='product-card-image'
                        style={{ width: cardWidth, height: cardWidth, objectFit: 'cover' }}
                    />

                    {trade_status !== 'ON_SALE' && (
                        <div className='product-card-status-overlay'>
                            <span className='product-card-status-text'>{tradeStatusText}</span>
                        </div>
                    )}

                    <div
                        className={`product-card-wishlist-button${isWishlisted ? ' wishlisted' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleWishlistClick();
                        }}
                    >
                        <img
                            src={isWishlisted ? '/images/product/wishlist-on.svg' : '/images/product/wishlist-off.svg'}
                            alt={isWishlisted ? '찜하기됨' : '찜하기'}
                            width={24}
                            height={24}
                        />
                    </div>
                </div>

                <div className='product-card-info'>
                    <h3 className='product-card-name'>{productName}</h3>
                </div>

                <div className='product-card-price-container'>
                    <span className='product-card-price'>{price}</span>
                </div>

                <div className='product-card-location-container'>
                    <span className='product-card-location-time'>
                        {location} | {timeAgo}
                    </span>
                </div>

                <div className='product-card-tags-container'>
                    <span className='product-card-tag'>{statusText}</span>
                </div>

                {showReviewButton && (
                    <div className='product-card-review-section'>
                        <button
                            className='product-card-review-button'
                            onClick={(e) => {
                                e.stopPropagation();
                                handleReviewClick();
                            }}
                            disabled={hasWrittenReview}
                        >
                            <span>리뷰작성</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
