'use client';

import { TradeStatus, getTradeStatusText } from '@/enums/tradeStatus';
import { ProductStatus, getProductStatusText } from '@/enums/productStatus';
import { timeAgo } from '@/utils/format';

import { useUser } from '@/store/userStore';

import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { productAPI } from '@/lib/api';
import ProductCard from '@/components/common/ProductCard';
import UserReviewList from '@/app/review/components/UserReviewList';
import './detail.css';
import ChatListSidebar from '@/app/chat/components/ChatListSideBar';
import { useCategoryStore } from '@/store/categoryStore';

const ProductDetail = () => {
    // TODO 관련상품리스트 조회 API 필요

    const { id } = useParams(); // URL에서 productId 가져오기
    const user = useUser(); // 로그인한 유저 정보 가져오기
    console.log('productId from URL:', id);

    const [product, setProduct] = useState(null);
    const [sellerInfo, setSellerInfo] = useState(null);
    const [sellerRecentProducts, setSellerRecentProducts] = useState(null);
    const [isMyProduct, setIsMyProduct] = useState(false);

    const [categoryPath, setCategoryPath] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [relatedSlideIndex, setRelatedSlideIndex] = useState(0);
    const [isProductInfoExpanded, setIsProductInfoExpanded] = useState(false);
    const [showMoreButton, setShowMoreButton] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(null);
    const [reviewSidebarOpen, setReviewSidebarOpen] = useState(false);

    const productInfoRef = useRef(null);
    const statusDropdownRef = useRef(null);

    // zustand에서 API로 가져온 카테고리 트리
    const categories = useCategoryStore((s) => s.categories);

    // 카테고리 ID로 경로 찾기
    const findCategoryPath = (categoryId) => {
        const searchInTree = (tree, path = []) => {
            for (const category of tree) {
                const currentPath = [...path, { id: category.id, name: category.name }];
                if (category.id.toString() === categoryId.toString()) {
                    return currentPath;
                }
                if (category.children && category.children.length > 0) {
                    const found = searchInTree(category.children, currentPath);
                    if (found) return found;
                }
            }
            return null;
        };
        return searchInTree(categories);
    };

    // ✅ 상품 상세 API 호출
    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const res = await productAPI.getProductDetail(id);
                const product = res.data.data.currentProduct;
                const sellerInfo = res.data.data.sellerInfo;
                const sellerRecentProducts = res.data.data.sellerRecentProducts;

                setProduct(product);
                setSellerInfo(sellerInfo);
                setSellerRecentProducts(sellerRecentProducts);

                // 상품 거래 상태
                setCurrentStatus(product.tradeStatus);

                // 찜 여부/개수 초기화
                setIsWishlisted(product.inWishlist);

                // 로그인 유저 = 판매자 비교
                setIsMyProduct(user && user.id === product.sellerId);

                console.log('product: ', product);
                console.log('sellerInfo: ', sellerInfo);
                console.log('sellerRecentProducts: ', sellerRecentProducts);

                if (categories.length > 0) {
                    const path = findCategoryPath(product.categoryId);
                    setCategoryPath(path || []);
                }
            } catch (error) {
                console.error('상품 정보를 가져오는데 실패했습니다:', error);
            }
        };

        fetchProductData();
    }, [id, categories]);

    // ✅ 거래 상태 변경 함수
    const handleChangeTradeStatus = async (newStatus) => {
        try {
            await productAPI.updateTradeStatus(product.id, newStatus);
            setCurrentStatus(newStatus);
            setShowStatusDropdown(false);
        } catch (err) {
            console.error('❌ 거래 상태 변경 실패:', err);
            alert('거래 상태 변경에 실패했습니다.');
        }
    };

    // TODO 찜/찜취소 API
    const handleToggleWishlist = async () => {
        try {
            if (!product) return;

            if (isWishlisted) {
                // 🔹 찜취소
                await productAPI.removeWishlist(product.id);
                setIsWishlisted(false);
                setProduct({
                    ...product,
                    wishlistCount: product.wishlistCount - 1,
                });
            } else {
                // 🔹 찜하기
                await productAPI.addWishlist(product.id);
                setIsWishlisted(true);
                setProduct({
                    ...product,
                    wishlistCount: product.wishlistCount + 1,
                });
            }
        } catch (err) {
            console.error('찜하기 처리 실패:', err);
            alert('찜하기에 실패했습니다.');
        }
    };

    // 상품 설명 더보기 버튼 여부
    useEffect(() => {
        if (productInfoRef.current) {
            const element = productInfoRef.current;
            const isOverflowing = element.scrollHeight > element.clientHeight;
            setShowMoreButton(isOverflowing);
        }
    }, [product?.content]);

    // 외부 클릭 시 상태 변경 드롭다운 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
                setShowStatusDropdown(false);
            }
        };

        if (showStatusDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showStatusDropdown]);

    // 카테고리 클릭 → 검색페이지 이동
    const handleCategoryClick = (categoryId) => {
        window.location.href = `/product/search?category=${categoryId}`;
    };

    // 이미지 넘기기
    const handleImageChange = (direction) => {
        if (!product?.images) return;
        if (direction === 'next') {
            setCurrentImageIndex((prev) => (prev < product.images.length - 1 ? prev + 1 : prev));
        } else {
            setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
    };

    // 슬라이드 함수
    const itemsPerSlide = 6;
    const cardWidth = 157;
    const gap = 10;
    const slideDistance = cardWidth + gap;

    const handleSlide = (direction, currentIndex, setIndex, totalItems) => {
        const maxIndex = Math.ceil(totalItems / itemsPerSlide) - 1;
        if (direction === 'next') {
            setIndex(currentIndex < maxIndex ? currentIndex + 1 : 0);
        } else {
            setIndex(currentIndex > 0 ? currentIndex - 1 : maxIndex);
        }
    };

    if (!product) return <div>상품 정보를 불러오는 중...</div>;

    // 관련 상품
    const relatedProducts = [
        {
            id: 1,
            productName: '상품명 ㅋㅋ',
            price: '5,000원',
            location: '송림 1동',
            timeAgo: '9시간 전',
            imageUrl:
                'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474',
            trade_status: 'ON_SALE',
            status: 'NEW',
            hasWrittenReview: false,
            showReviewButton: false,
        },
        {
            id: 2,
            productName: '상품명 ㅋㅋ',
            price: '5,000원',
            location: '송림 1동',
            timeAgo: '9시간 전',
            imageUrl:
                'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474',
            trade_status: 'ON_SALE',
            status: 'NEW',
            hasWrittenReview: false,
            showReviewButton: false,
        },
        {
            id: 3,
            productName: '상품명 ㅋㅋ',
            price: '5,000원',
            location: '송림 1동',
            timeAgo: '9시간 전',
            imageUrl:
                'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474',
            trade_status: 'ON_SALE',
            status: 'NEW',
            hasWrittenReview: false,
            showReviewButton: false,
        },
        {
            id: 4,
            productName: '상품명 ㅋㅋ',
            price: '5,000원',
            location: '송림 1동',
            timeAgo: '9시간 전',
            imageUrl:
                'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474',
            trade_status: 'ON_SALE',
            status: 'NEW',
            hasWrittenReview: false,
            showReviewButton: false,
        },
        {
            id: 5,
            productName: '상품명 ㅋㅋ',
            price: '5,000원',
            location: '송림 1동',
            timeAgo: '9시간 전',
            imageUrl:
                'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474',
            trade_status: 'ON_SALE',
            status: 'NEW',
            hasWrittenReview: false,
            showReviewButton: false,
        },
        {
            id: 6,
            productName: '상품명 ㅋㅋ',
            price: '5,000원',
            location: '송림 1동',
            timeAgo: '9시간 전',
            imageUrl:
                'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474',
            trade_status: 'ON_SALE',
            status: 'NEW',
            hasWrittenReview: false,
            showReviewButton: false,
        },
        {
            id: 7,
            productName: '상품명 ㅋㅋ',
            price: '5,000원',
            location: '송림 1동',
            timeAgo: '9시간 전',
            imageUrl:
                'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474',
            trade_status: 'ON_SALE',
            status: 'NEW',
            hasWrittenReview: false,
            showReviewButton: false,
        },
        {
            id: 8,
            productName: '상품명 ㅋㅋ',
            price: '5,000원',
            location: '송림 1동',
            timeAgo: '9시간 전',
            imageUrl:
                'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474',
            trade_status: 'ON_SALE',
            status: 'NEW',
            hasWrittenReview: false,
            showReviewButton: false,
        },
        {
            id: 9,
            productName: '상품명 ㅋㅋ',
            price: '5,000원',
            location: '송림 1동',
            timeAgo: '9시간 전',
            imageUrl:
                'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474',
            trade_status: 'ON_SALE',
            status: 'NEW',
            hasWrittenReview: false,
            showReviewButton: false,
        },
        {
            id: 10,
            productName: '상품명 ㅋㅋ',
            price: '5,000원',
            location: '송림 1동',
            timeAgo: '9시간 전',
            imageUrl:
                'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474',
            trade_status: 'ON_SALE',
            status: 'NEW',
            hasWrittenReview: false,
            showReviewButton: false,
        },
        {
            id: 11,
            productName: '상품명 ㅋㅋ',
            price: '5,000원',
            location: '송림 1동',
            timeAgo: '9시간 전',
            imageUrl:
                'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474',
            trade_status: 'ON_SALE',
            status: 'NEW',
            hasWrittenReview: false,
            showReviewButton: false,
        },
        {
            id: 12,
            productName: '상품명 ㅋㅋ',
            price: '5,000원',
            location: '송림 1동',
            timeAgo: '9시간 전',
            imageUrl:
                'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474',
            trade_status: 'ON_SALE',
            status: 'NEW',
            hasWrittenReview: false,
            showReviewButton: false,
        },
    ];

    return (
        <div className='product-detail-container'>
            {/* Product Section */}
            <div className='product-detail-section'>
                <div className='product-detail-header'>
                    <div className='product-detail-image-navigation'>
                        <button
                            className='product-detail-nav-button product-detail-right'
                            onClick={() => handleImageChange('prev')}
                            disabled={currentImageIndex === 0}
                        >
                            <svg width='13' height='25' viewBox='0 0 13 25' fill='none'>
                                <path d='M12.5 1L1 12.5L12.5 24' stroke='black' strokeWidth='3' />
                            </svg>
                        </button>

                        <div className='product-detail-main-image-container'>
                            <img
                                src={product.images[currentImageIndex].url}
                                alt='상품 이미지'
                                width={476}
                                height={476}
                                className='product-detail-main-image'
                            />
                            <div className='product-detail-image-counter'>
                                {currentImageIndex + 1} / {product.images.length}
                            </div>
                        </div>

                        <button
                            className='product-detail-nav-button product-detail-left'
                            onClick={() => handleImageChange('next')}
                            disabled={currentImageIndex === product.images.length - 1}
                        >
                            <svg width='13' height='25' viewBox='0 0 13 25' fill='none'>
                                <path d='M12.5 1L1 12.5L12.5 24' stroke='black' strokeWidth='3' />
                            </svg>
                        </button>
                    </div>

                    <div className='product-detail-info'>
                        <div className='product-detail-breadcrumb'>
                            {categoryPath.map((category, index) => (
                                <React.Fragment key={category.id}>
                                    <span
                                        className={
                                            index === categoryPath.length - 1
                                                ? 'product-detail-breadcrumb-category product-detail-current'
                                                : 'product-detail-breadcrumb-category'
                                        }
                                        onClick={() => handleCategoryClick(category.id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {category.name}
                                    </span>
                                    {index < categoryPath.length - 1 && (
                                        <span className='product-detail-separator'>{'>'}</span>
                                    )}
                                </React.Fragment>
                            ))}
                            {categoryPath.length === 0 && (
                                <>
                                    <span className='product-detail-breadcrumb-category'>카테고리</span>
                                    <span className='product-detail-separator'>{'>'}</span>
                                    <span className='product-detail-current'>상품</span>
                                </>
                            )}
                        </div>

                        <div className='product-detail-title'>
                            <h1>{product.name}</h1>
                            <button
                                className='product-detail-link-button'
                                onClick={() => {
                                    navigator.clipboard
                                        .writeText(window.location.href)
                                        .then(() => {
                                            alert('URL이 복사되었습니다!');
                                        })
                                        .catch(() => {
                                            alert('URL 복사에 실패했습니다.');
                                        });
                                }}
                            >
                                <img src='/images/product/link.svg' alt='링크' width={24} height={24} />
                            </button>
                        </div>

                        <div className='product-detail-price'>
                            <span>{product.price.toLocaleString()}원</span>
                        </div>

                        <div className='product-detail-meta'>
                            <span>
                                {timeAgo(product.createdAt)} · 조회 {product.viewCount} · 찜 {product.wishlistCount}
                            </span>
                        </div>

                        <div className='product-detail-details'>
                            <div className='product-detail-detail-item'>
                                <div className='product-detail-dot'></div>
                                <span>상품상태</span>
                                <span className='product-detail-tag'>
                                    {getProductStatusText(product.productStatus)}
                                </span>
                            </div>

                            <div className='product-detail-detail-item'>
                                <div className='product-detail-dot'></div>
                                <span>거래희망지역</span>
                                <div className='product-detail-location-tags'>
                                    {product?.tradeAreas?.map((area, index) => (
                                        <div key={index} className='product-detail-location-tag'>
                                            <img
                                                src='/images/product/address-marker.svg'
                                                alt='위치'
                                                width={12}
                                                height={12}
                                            />
                                            <span>{area}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className='product-detail-hashtags'>
                                <div className='product-detail-hashtag-row'>
                                    {product.hashtags.map((tag, index) => (
                                        <span key={index} className='product-detail-hashtag'>
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className='product-detail-action-buttons'>
                            {isMyProduct ? (
                                // 내 상품일 때: 상품수정, 상태변경, 삭제 버튼
                                <div className='product-detail-trade-actions-container'>
                                    <div className='product-detail-trade-action-item'>
                                        <img src='/images/product/edit-product.svg' alt='수정' width={18} height={18} />
                                        {/* TODO 상품 수정 API 필요. 상품 수정 페이지 이동 필요 */}
                                        <span>상품수정</span>
                                    </div>
                                    <span className='product-detail-trade-divider'>|</span>
                                    <div className='product-detail-trade-action-item' style={{ position: 'relative' }}>
                                        <div
                                            className='product-detail-trade-action-trigger'
                                            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                        >
                                            <img
                                                src='/images/product/update-status.svg'
                                                alt='상태변경'
                                                width={18}
                                                height={18}
                                            />
                                            <span>상태변경</span>
                                        </div>

                                        {/* 상태변경 드롭다운 */}
                                        {showStatusDropdown && (
                                            <div className='product-detail-status-dropdown' ref={statusDropdownRef}>
                                                {currentStatus !== TradeStatus.RESERVED && (
                                                    <div
                                                        className='product-detail-status-option'
                                                        onClick={() => handleChangeTradeStatus(TradeStatus.RESERVED)}
                                                    >
                                                        {getTradeStatusText(TradeStatus.RESERVED)}
                                                    </div>
                                                )}
                                                {currentStatus !== TradeStatus.ON_SALE && (
                                                    <div
                                                        className='product-detail-status-option'
                                                        onClick={() => handleChangeTradeStatus(TradeStatus.ON_SALE)}
                                                    >
                                                        {getTradeStatusText(TradeStatus.ON_SALE)}
                                                    </div>
                                                )}
                                                {currentStatus !== TradeStatus.ON_HOLD && (
                                                    <div
                                                        className='product-detail-status-option'
                                                        onClick={() => handleChangeTradeStatus(TradeStatus.ON_HOLD)}
                                                    >
                                                        {getTradeStatusText(TradeStatus.ON_HOLD)}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <span className='product-detail-trade-divider'>|</span>
                                    <div className='product-detail-trade-action-item'>
                                        <img
                                            src='/images/product/delete-product.svg'
                                            alt='삭제'
                                            width={18}
                                            height={18}
                                        />
                                        <span>상품삭제</span>
                                    </div>
                                </div>
                            ) : (
                                // 다른 사람의 상품일 때: 찜하기, 채팅하기 버튼
                                <>
                                    <button
                                        className={`product-detail-wishlist-button ${isWishlisted ? 'active' : ''}`}
                                        onClick={handleToggleWishlist}
                                    >
                                        <img
                                            src={
                                                isWishlisted
                                                    ? '/images/product/detail-wishlist-on.svg'
                                                    : '/images/product/detail-wishlist-off.svg'
                                            }
                                            alt={isWishlisted ? '찜하기됨' : '찜하기'}
                                        />
                                    </button>
                                    <ChatListSidebar
                                        trigger={<button className='product-detail-chat-button'>채팅하기</button>}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Information Section */}
            <div className='product-detail-info-section'>
                <div
                    className={`product-detail-product-info-section ${isMyProduct ? 'product-detail-full-width' : ''}`}
                >
                    <div className='product-detail-section-header'>
                        <h2>상품 정보</h2>
                    </div>
                    <div
                        ref={productInfoRef}
                        className={`product-detail-section-content ${
                            !isProductInfoExpanded ? 'product-detail-collapsed' : ''
                        }`}
                        style={{
                            maxHeight: isProductInfoExpanded ? 'none' : '434px',
                            overflow: 'hidden',
                            transition: 'max-height 0.3s ease',
                        }}
                    >
                        <div className='product-detail-content-text'>{product.content}</div>
                    </div>
                    {showMoreButton && (
                        <button
                            className='product-detail-more-button'
                            onClick={() => setIsProductInfoExpanded(!isProductInfoExpanded)}
                        >
                            {isProductInfoExpanded ? '접기' : '더 보기'}
                        </button>
                    )}
                </div>

                {!isMyProduct && (
                    <div className='product-detail-store-info-section'>
                        <div className='product-detail-section-header'>
                            <h2>가게 정보</h2>
                            <button className='product-detail-more-link'>
                                <svg width='26' height='26' viewBox='0 0 26 26' fill='none'>
                                    <path d='M9.75 6.5L16.25 13L9.75 19.5' stroke='black' strokeWidth='2' />
                                </svg>
                            </button>
                        </div>

                        <div className='product-detail-profile-info'>
                            <div className='product-detail-profile-details'>
                                <span className='product-detail-username'>{sellerInfo.nickname}</span>
                            </div>
                            <div className='product-detail-profile-image'>
                                <img
                                    src={sellerInfo.profileImageUrl}
                                    alt='프로필 이미지'
                                    width={56}
                                    height={56}
                                    className='product-detail-profile-img'
                                />
                            </div>
                        </div>

                        <div className='product-detail-trade-info'>
                            <div className='product-detail-trade-stat'>
                                <span className='product-detail-stat-label'>거래 횟수</span>
                                <span className='product-detail-stat-value'>{sellerInfo.tradeCount}</span>
                            </div>
                            <span className='product-detail-divider'>|</span>
                            <div className='product-detail-trade-stat'>
                                <span className='product-detail-stat-label'>리뷰수</span>
                                {/* 리뷰 사이드바 */}
                                <UserReviewList open={reviewSidebarOpen} onClose={() => setReviewSidebarOpen(false)} />
                                <a
                                    href='#'
                                    className='product-detail-stat-value'
                                    style={{ textDecoration: 'underline', cursor: 'pointer' }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setReviewSidebarOpen(true);
                                    }}
                                >
                                    {sellerInfo.reviewCount}
                                </a>
                            </div>
                        </div>

                        <div className='product-detail-seller-products'>
                            {sellerRecentProducts.map((product) => (
                                <ProductCard key={product.id} product={product} size='size0' />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Related Products Section */}
            <div className='product-detail-related-section'>
                <div className='product-detail-section-title'>
                    <h2>이런 상품은 어때요?</h2>
                </div>

                <div className='product-detail-related-products'>
                    <div className='product-detail-related-products-grid'>
                        <div
                            className='product-detail-related-products-slider'
                            style={{
                                transform: `translateX(-${relatedSlideIndex * slideDistance * itemsPerSlide}px)`,
                            }}
                        >
                            {relatedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} size='size1' />
                            ))}
                        </div>
                    </div>
                    <div className='product-detail-related-navigation-arrows'>
                        <button
                            className='product-detail-related-nav-arrow product-detail-left'
                            disabled={relatedSlideIndex === 0}
                            onClick={() =>
                                handleSlide('prev', relatedSlideIndex, setRelatedSlideIndex, relatedProducts.length)
                            }
                        >
                            <img src='/images/main/arrow-left.svg' alt='이전' />
                        </button>
                        <button
                            className='product-detail-related-nav-arrow product-detail-right'
                            disabled={relatedSlideIndex >= Math.ceil(relatedProducts.length / itemsPerSlide) - 1}
                            onClick={() =>
                                handleSlide('next', relatedSlideIndex, setRelatedSlideIndex, relatedProducts.length)
                            }
                        >
                            <img src='/images/main/arrow-right.svg' alt='다음' />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
