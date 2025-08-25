'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/common/ProductCard';
import UserReviewList from '@/app/review/components/UserReviewList';
import './detail.css';
import ChatListSidebar from '@/app/chat/components/ChatListSideBar';
import { MessageCircleMore } from 'lucide-react';

const ProductDetail = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [relatedSlideIndex, setRelatedSlideIndex] = useState(0);
    const [isProductInfoExpanded, setIsProductInfoExpanded] = useState(false);
    const [showMoreButton, setShowMoreButton] = useState(false);
    const [product, setProduct] = useState(null);
    const [categoryPath, setCategoryPath] = useState([]);
    const productInfoRef = useRef(null);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [currentStatus, setCurrentStatus] = useState('ON_SALE'); // 기본값: 판매중
    const statusDropdownRef = useRef(null);
    const [reviewSidebarOpen, setReviewSidebarOpen] = useState(false);

    // my product 여부
    const isMyProduct = false;

    // 카테고리 데이터
    const categories = [
        { id: 1, name: '출산/육아용품' },
        { id: 2, name: '유아동의류' },
        { id: 3, name: '유아동잡화' },
        { id: 4, name: '유아동교구/완구' },
        { id: 5, name: '유아동안전/실내용품' },
        { id: 6, name: '유아동가구' },
    ];

    // 카테고리 ID로 경로 찾기
    const findCategoryPath = (categoryId) => {
        const searchInTree = (tree, path = []) => {
            for (const category of tree) {
                const currentPath = [...path, { id: category.id, name: category.name }];
                if (category.id.toString() === categoryId.toString()) {
                    return currentPath;
                }
                if (category.children) {
                    const found = searchInTree(category.children, currentPath);
                    if (found) return found;
                }
            }
            return null;
        };
        return searchInTree(babyCategoryTree);
    };

    // 카테고리 클릭 핸들러
    const handleCategoryClick = (categoryId) => {
        window.location.href = `/product/search?category=${categoryId}`;
    };

    // 카테고리 데이터 (트리 구조)
    const babyCategoryTree = [
        {
            id: 1,
            name: '출산/육아용품',
            parentId: null,
            children: [
                {
                    id: 101,
                    name: '모유수유용품',
                    parentId: 1,
                    children: [
                        { id: 1011, name: '유축기', parentId: 101, children: [] },
                        {
                            id: 1012,
                            name: '수유패드',
                            parentId: 101,
                            children: [
                                {
                                    id: 1013,
                                    name: '수유쿠션',
                                    parentId: 1012,
                                    children: [
                                        { id: 1014, name: '모유 저장팩/병', parentId: 1013, children: [] },
                                        { id: 1015, name: '젖병 세척용품', parentId: 1013, children: [] },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                { id: 102, name: '분유수유용품', parentId: 1, children: [] },
                { id: 103, name: '튼살크림/스킨케어', parentId: 1, children: [] },
                { id: 104, name: '임부복/수유복/언더웨어', parentId: 1, children: [] },
                { id: 105, name: '물티슈/기저귀', parentId: 1, children: [] },
                { id: 106, name: '분유/이유식', parentId: 1, children: [] },
                { id: 107, name: '아기띠/기저귀가방', parentId: 1, children: [] },
                { id: 108, name: '신생아/영유아의류', parentId: 1, children: [] },
                { id: 109, name: '유아로션/목욕용품', parentId: 1, children: [] },
                { id: 110, name: '유아건강/위생용품', parentId: 1, children: [] },
                { id: 111, name: '유모차/웨건', parentId: 1, children: [] },
            ],
        },
        {
            id: 2,
            name: '유아동의류',
            parentId: null,
            children: [
                { id: 201, name: '유아용의류', parentId: 2, children: [] },
                { id: 202, name: '아동용의류', parentId: 2, children: [] },
                { id: 203, name: '내의/잠옷/속옷', parentId: 2, children: [] },
                { id: 204, name: '패딩/자켓', parentId: 2, children: [] },
                { id: 205, name: '한복/소품', parentId: 2, children: [] },
            ],
        },
        {
            id: 3,
            name: '유아동잡화',
            parentId: null,
            children: [
                { id: 301, name: '구두/운동화/샌들/부츠', parentId: 3, children: [] },
                { id: 302, name: '장화/우비/우산', parentId: 3, children: [] },
                { id: 303, name: '모자/장갑', parentId: 3, children: [] },
                { id: 304, name: '책가방/여행가방', parentId: 3, children: [] },
            ],
        },
        {
            id: 4,
            name: '유아동교구/완구',
            parentId: null,
            children: [
                { id: 401, name: '신생아완구', parentId: 4, children: [] },
                { id: 402, name: '원목교구', parentId: 4, children: [] },
                { id: 403, name: '음악놀이/자석교구', parentId: 4, children: [] },
                { id: 404, name: '전동차/핫휠', parentId: 4, children: [] },
                { id: 405, name: '로봇', parentId: 4, children: [] },
                { id: 406, name: '인형/디즈니의상', parentId: 4, children: [] },
                { id: 407, name: '블록/레고', parentId: 4, children: [] },
                { id: 408, name: '대형 완구용품', parentId: 4, children: [] },
            ],
        },
        {
            id: 5,
            name: '유아동안전/실내용품',
            parentId: null,
            children: [{ id: 501, name: '카시트', parentId: 5, children: [] }],
        },
        {
            id: 6,
            name: '유아동가구',
            parentId: null,
            children: [{ id: 601, name: '침대/매트리스', parentId: 6, children: [] }],
        },
        {
            id: 7,
            name: '기타 유아동용품',
            parentId: null,
            children: [],
        },
    ];

    const productImages = [
        'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474',
        'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474',
        'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474',
        'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474',
        'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474',
        'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474',
        'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474',
        'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474',
        'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474',
        'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474',
        'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474',
        'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474',
    ];

    const hashtags = [
        '# 해시태그12312312312321',
        '# 해시태그',
        '# 해시태그',
        '# 해시태그',
        '# 해시태그',
        '# 해시태그',
        '# 해시태그',
        '# 해시태그',
        '# 해시태그',
        '# 해시태그',
        '# 해시태그',
        '# 해시태그',
    ];

    // 슬라이드 설정
    const itemsPerSlide = 6; // 한 번에 보여줄 아이템 수
    const cardWidth = 157; // 카드 너비
    const gap = 10; // 카드 간격
    const slideDistance = cardWidth + gap; // 슬라이드 거리

    // 상품 정보 더보기 기능
    useEffect(() => {
        if (productInfoRef.current) {
            const element = productInfoRef.current;
            const isOverflowing = element.scrollHeight > element.clientHeight;
            setShowMoreButton(isOverflowing);
        }
    }, [product?.content]);

    // 외부 클릭 시 드롭다운 닫기
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

    // 상품 데이터 가져오기 (실제로는 API 호출)
    useEffect(() => {
        // TODO: 실제 API 호출로 대체
        const fetchProductData = async () => {
            try {
                // const response = await fetch(`/api/products/${productId}`);
                // const data = await response.json();
                // setProduct(data);

                // 임시 데이터 (실제 구현 시 제거)
                setProduct({
                    id: 1,
                    categoryId: 201, // 유아용의류 카테고리 ID
                    content: `상품 정보입니다.

추가 상품 정보 내용이 여기에 들어갑니다. 이 내용이 많아지면 더보기 버튼이 나타납니다. ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ

더 많은 상품 정보를 표시하기 위한 추가 텍스트입니다.


























상품의 상세한 설명과 특징들이 이곳에 표시됩니다.

백엔드에서 받아온 텍스트 형태의 content가 여기에 렌더링됩니다. 줄바꿈도 자동으로 처리됩니다.`,
                });

                // 카테고리 경로 설정 (실제로는 상품 데이터에서 categoryId를 받아와야 함)
                const path = findCategoryPath(201); // 유아용의류 경로: 출산/육아용품 > 유아동의류 > 유아용의류
                setCategoryPath(path || []);
            } catch (error) {
                console.error('상품 정보를 가져오는데 실패했습니다:', error);
            }
        };

        fetchProductData();
    }, []);

    // 슬라이드 함수들 - 스르륵 움직임
    const handleSlide = (direction, currentIndex, setIndex, totalItems) => {
        const maxIndex = Math.ceil(totalItems / itemsPerSlide) - 1;

        if (direction === 'next') {
            setIndex(currentIndex < maxIndex ? currentIndex + 1 : 0);
        } else {
            setIndex(currentIndex > 0 ? currentIndex - 1 : maxIndex);
        }
    };

    const getVisibleItems = (items, slideIndex) => {
        const startIndex = slideIndex * itemsPerSlide;
        return items.slice(startIndex, startIndex + itemsPerSlide);
    };

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

    const sellerProducts = [
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
    ];

    const handleImageChange = (direction) => {
        if (direction === 'next') {
            setCurrentImageIndex((prev) => (prev < productImages.length - 1 ? prev + 1 : prev));
        } else {
            setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
    };

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
                                src={productImages[currentImageIndex]}
                                alt='상품 이미지'
                                width={476}
                                height={476}
                                className='product-detail-main-image'
                            />
                            <div className='product-detail-image-counter'>
                                {currentImageIndex + 1} / {productImages.length}
                            </div>
                        </div>

                        <button
                            className='product-detail-nav-button product-detail-left'
                            onClick={() => handleImageChange('next')}
                            disabled={currentImageIndex === productImages.length - 1}
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
                            <h1>유아동의류ㅋㅋㅋㅋ유아동의류ㅋㅋㅋㅋ유아동의류ㅋㅋㅋㅋ유아동의류ㅋㅋㅋㅋ</h1>
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
                            <span>50,000원</span>
                        </div>

                        <div className='product-detail-meta'>
                            <span>7시간 전 · 조회 0 · 찜 0</span>
                        </div>

                        <div className='product-detail-details'>
                            <div className='product-detail-detail-item'>
                                <div className='product-detail-dot'></div>
                                <span>상품상태</span>
                                <span className='product-detail-tag'>새상품</span>
                            </div>

                            <div className='product-detail-detail-item'>
                                <div className='product-detail-dot'></div>
                                <span>거래희망지역</span>
                                <div className='product-detail-location-tags'>
                                    <div className='product-detail-location-tag'>
                                        <img
                                            src='/images/product/address-marker.svg'
                                            alt='위치'
                                            width={12}
                                            height={12}
                                        />
                                        <span>사당1동</span>
                                    </div>
                                    <div className='product-detail-location-tag'>
                                        <img
                                            src='/images/product/address-marker.svg'
                                            alt='위치'
                                            width={12}
                                            height={12}
                                        />
                                        <span>사당1동</span>
                                    </div>
                                    <div className='product-detail-location-tag'>
                                        <img
                                            src='/images/product/address-marker.svg'
                                            alt='위치'
                                            width={12}
                                            height={12}
                                        />
                                        <span>사당1동</span>
                                    </div>
                                </div>
                            </div>

                            <div className='product-detail-hashtags'>
                                <div className='product-detail-hashtag-row'>
                                    {hashtags.map((tag, index) => (
                                        <span key={index} className='product-detail-hashtag'>
                                            {tag}
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
                                                {currentStatus !== 'RESERVED' && (
                                                    <div
                                                        className='product-detail-status-option'
                                                        onClick={() => {
                                                            setCurrentStatus('RESERVED');
                                                            setShowStatusDropdown(false);
                                                        }}
                                                    >
                                                        예약중
                                                    </div>
                                                )}
                                                {currentStatus !== 'ON_SALE' && (
                                                    <div
                                                        className='product-detail-status-option'
                                                        onClick={() => {
                                                            setCurrentStatus('ON_SALE');
                                                            setShowStatusDropdown(false);
                                                        }}
                                                    >
                                                        판매중
                                                    </div>
                                                )}
                                                {currentStatus !== 'ON_HOLD' && (
                                                    <div
                                                        className='product-detail-status-option'
                                                        onClick={() => {
                                                            setCurrentStatus('ON_HOLD');
                                                            setShowStatusDropdown(false);
                                                        }}
                                                    >
                                                        판매보류
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
                                        className={`product-detail-wishlist-button ${
                                            isWishlisted ? 'product-detail-active' : ''
                                        }`}
                                        onClick={() => setIsWishlisted(!isWishlisted)}
                                    >
                                        <img
                                            src={
                                                isWishlisted
                                                    ? '/images/product/detail-wishlist-on.svg'
                                                    : '/images/product/detail-wishlist-off.svg'
                                            }
                                            alt={isWishlisted ? '찜하기됨' : '찜하기'}
                                            width={36}
                                            height={36}
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
                        <div className='product-detail-content-text'>{product?.content || '상품 정보가 없습니다.'}</div>
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
                                <span className='product-detail-username'>닉넴닉크넴</span>
                            </div>
                            <div className='product-detail-profile-image'>
                                <img
                                    src='https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474'
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
                                <span className='product-detail-stat-value'>44</span>
                            </div>
                            <span className='product-detail-divider'>|</span>
                            <div className='product-detail-trade-stat'>
                                <span className='product-detail-stat-label'>리뷰수</span>
                                {/* 리뷰 사이드바 */}
                                <UserReviewList open={reviewSidebarOpen} onClose={() => setReviewSidebarOpen(false)} user={{ name: '닉넴닉크넴' }} />
                                <a
                                    href='#'
                                    className='product-detail-stat-value'
                                    style={{ textDecoration: 'underline', cursor: 'pointer' }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setReviewSidebarOpen(true);
                                    }}
                                >
                                    44
                                </a>
                            </div>
                        </div>

                        <div className='product-detail-seller-products'>
                            {sellerProducts.map((product) => (
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
