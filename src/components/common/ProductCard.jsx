'use client';

import React, { useState } from 'react';
import '@/common-css/ProductCard.css';

const CARD_SIZES = {
    size1: 157,
    size2: 181,
    size3: 235,
};

const ProductCard = ({ product, onReviewClick, size }) => {
    const {
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

    const handleReviewClick = () => {
        if (onReviewClick) {
            onReviewClick();
        }
    };

    return (
        <div className={`product-card${trade_status !== 'ON_SALE' ? ' statused' : ''}`} style={{ width: cardWidth }}>
            <div className='product-image-container' style={{ width: cardWidth, height: cardWidth }}>
                <img
                    src={imageUrl}
                    alt={`${productName} 이미지`}
                    className='product-image'
                    style={{ width: cardWidth, height: cardWidth, objectFit: 'cover' }}
                />

                {trade_status !== 'ON_SALE' && (
                    <div className='status-overlay'>
                        <span className='status-text'>{tradeStatusText}</span>
                    </div>
                )}

                <div className={`wishlist-button${isWishlisted ? ' wishlisted' : ''}`} onClick={handleWishlistClick}>
                    <img
                        src={isWishlisted ? '/images/product/wishlist-on.svg' : '/images/product/wishlist-off.svg'}
                        alt={isWishlisted ? '찜하기됨' : '찜하기'}
                        width={24}
                        height={24}
                    />
                </div>
            </div>

            <div className='product-info'>
                <h3 className='product-name'>{productName}</h3>
            </div>

            <div className='product-price'>
                <span className='price'>{price}</span>
            </div>

            <div className='product-location'>
                <span className='location-time'>
                    {location} | {timeAgo}
                </span>
            </div>

            <div className='product-tags'>
                <span className='tag product-tag'>{statusText}</span>
            </div>

            {showReviewButton && (
                <div className='review-section'>
                    <button className='review-button' onClick={handleReviewClick} disabled={hasWrittenReview}>
                        <span>리뷰작성</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductCard;
