'use client';

import React, { useState } from 'react';
import { productAPI } from '@/lib/api';

import { useRouter } from 'next/navigation';
import { useIsAuthenticated } from '@/store/userStore';
import { TradeStatus, getTradeStatusText } from '@/enums/tradeStatus';
import { ProductStatus, getProductStatusText } from '@/enums/productStatus';
import { timeAgo } from '@/utils/format';
import '@/common-css/ProductCard.css';
import MyReviewAddForm from '@/app/review/components/MyReviewAddForm.jsx';

const CARD_SIZES = {
    size0: 132,
    size1: 157,
    size2: 181,
    size3: 235,
};

const ProductCard = ({
    product,
    size,
    variant = 'normal',
    onRemoveFromWishlist,
    onProductClick,
    showReviewButton = false, // 기본값 false
}) => {
    const {
        id,
        name,
        thumbnailUrl,
        inWishlist,
        price,
        emd,
        createdAt, // createdAt 기반
        tradeStatus,
        productStatus,
        hasWrittenReview,
    } = product;

    const [isWishlisted, setIsWishlisted] = useState(inWishlist);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const cardWidth = CARD_SIZES[size] || CARD_SIZES.size1;
    const router = useRouter();

    // 인증
    const isAuthenticated = useIsAuthenticated();

    // 상품 & 거래 상태
    const tradeStatusText = getTradeStatusText(tradeStatus);
    const productStatusText = getProductStatusText(productStatus);

    // 상품 등록 시간
    const timeAgoText = timeAgo(createdAt);

    // ✅ 찜하기 / 찜취소
    const handleWishlistClick = async (e) => {
        e.stopPropagation();

        if (!isAuthenticated) {
            e.preventDefault?.();
            router.push('/login');
            return;
        }

        try {
            if (isWishlisted) {
                await productAPI.removeWishlist(id);
                setIsWishlisted(false);

                // ✅ 부모에 알리기 (wishlist 모드일 때만)
                if (variant === 'wishlist' && onRemoveFromWishlist) {
                    onRemoveFromWishlist(id);
                }
            } else {
                await productAPI.addWishlist(id);
                setIsWishlisted(true);
            }
        } catch (err) {
            console.error('찜 처리 에러:', err);
            // TODO: 토스트나 알림 추가 가능
        }
    };

    const handleProductClick = () => {
        console.log('handleProductClick');
        // 리뷰 폼이 열려있으면 상품 클릭 무시
        if (showReviewForm) {
            return;
        }

        if (onProductClick) {
            onProductClick(product);
        } else {
            // 기본 동작: 상품 상세 페이지로 이동
            router.push(`/product/${id}`);
        }
    };

    const handleReviewClick = () => {
        setShowReviewForm(true);
    };

    const handleReviewFormClose = () => {
        setShowReviewForm(false);
    };

    // wishlist 모드일 때의 렌더링
    if (variant === 'wishlist') {
        return (
            <div className='wishlist-product-card' onClick={handleProductClick} style={{ cursor: 'pointer' }}>
                {/* 이미지 영역 */}
                <div className='product-image-container'>
                    <img
                        src={thumbnailUrl || 'https://via.placeholder.com/176x176/E3E3E3/999999?text=상품이미지'}
                        alt={`${name} 이미지`}
                        className='product-image'
                    />

                    {/* 상품 상태 오버레이 (판매보류, 판매완료, 예약중 등) */}
                    {tradeStatus !== TradeStatus.ON_SALE && (
                        <div className='product-status-overlay'>
                            <span className='product-status-text'>{tradeStatusText}</span>
                        </div>
                    )}

                    {/* 찜하기 버튼 */}
                    <div className='wishlist-button active' onClick={handleWishlistClick} title='찜한 상품에서 제거'>
                        <img src='/images/product/wishlist-on.svg' alt='찜하기됨' width={24} height={24} />
                    </div>
                </div>

                {/* 상품 정보 */}
                <div className='product-info'>
                    <div className='product-details'>
                        <h3 className='product-name' title={name}>
                            {name}
                        </h3>
                        <div className='product-price'>
                            <span className='price'>{price.toLocaleString()}원</span>
                        </div>
                        <div className='product-location'>
                            <span className='location-time'>
                                {emd} | {timeAgoText}
                            </span>
                        </div>
                        <div className='product-tags'>
                            <span
                                className={`tag ${
                                    productStatus === ProductStatus.NEW ? 'new-product' : 'used-product'
                                }`}
                            >
                                {productStatusText}
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
                className={`product-card-container${tradeStatus !== TradeStatus.ON_SALE ? ' statused' : ''}`}
                style={{ width: cardWidth, cursor: 'pointer' }}
                onClick={handleProductClick}
            >
                <div className='product-card-image-container' style={{ width: cardWidth, height: cardWidth }}>
                    <img
                        src={thumbnailUrl}
                        alt={`${name} 이미지`}
                        className='product-card-image'
                        style={{ width: cardWidth, height: cardWidth, objectFit: 'cover' }}
                    />

                    {tradeStatus !== TradeStatus.ON_SALE && (
                        <div className='product-card-status-overlay'>
                            <span className='product-card-status-text'>{tradeStatusText}</span>
                        </div>
                    )}

                    <div
                        className={`product-card-wishlist-button${isWishlisted ? ' wishlisted' : ''}`}
                        onClick={handleWishlistClick}
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
                    <h3 className='product-card-name'>{name}</h3>
                </div>

                <div className='product-card-price-container'>
                    <span className='product-card-price'>{price.toLocaleString()}원</span>
                </div>

                <div className='product-card-location-container'>
                    <span className='product-card-location-time'>
                        {emd} | {timeAgoText}
                    </span>
                </div>

                <div className='product-card-tags-container'>
                    <span className='product-card-tag'>{productStatusText}</span>
                </div>

                {showReviewButton && (
                    <div
                        className='product-card-review-section'
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.nativeEvent.stopImmediatePropagation();
                        }}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.nativeEvent.stopImmediatePropagation();
                        }}
                    >
                        <button
                            className='product-card-review-button'
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                e.nativeEvent.stopImmediatePropagation();
                                handleReviewClick();
                            }}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                e.nativeEvent.stopImmediatePropagation();
                            }}
                            disabled={hasWrittenReview}
                        >
                            <span>리뷰작성</span>
                        </button>
                    </div>
                )}

                {/* 리뷰 폼이 표시될 때만 렌더링 */}
                {showReviewForm && <MyReviewAddForm onClose={handleReviewFormClose} pId={product.id} />}
            </div>
        </div>
    );
};

export default ProductCard;
