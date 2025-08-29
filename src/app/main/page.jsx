'use client';

import { productAPI } from '@/lib/api';

import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/common/ProductCard';
import './Main.css';

export default function MainPage() {
    // 슬라이드 상태 관리 - 스르륵 슬라이드
    const [popularSlideIndex, setPopularSlideIndex] = useState(0);
    const [recommendedSlideIndex, setRecommendedSlideIndex] = useState(0);
    const [newSlideIndex, setNewSlideIndex] = useState(0);

    // 상품 리스트
    const [popularProducts, setPopularProducts] = useState([]);
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [newProducts, setNewProducts] = useState([]);

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const { data } = await productAPI.getHomeSections();
                if (data.success) {
                    setPopularProducts(data.data.popular);
                    setRecommendedProducts(data.data.recommended);
                    setNewProducts(data.data.latest);
                }
            } catch (err) {
                console.error('홈 섹션 조회 실패:', err);
            }
        };

        fetchSections();
    }, []);

    // 슬라이드 관련
    const itemsPerSlide = 6; // 한 번에 보여줄 아이템 수
    const cardWidth = 157; // 카드 너비
    const gap = 10; // 카드 간격
    const slideDistance = cardWidth + gap; // 슬라이드 거리

    // 슬라이드 함수들 - 스르륵 움직임
    const handleSlide = (direction, currentIndex, setIndex, totalItems) => {
        const maxIndex = Math.ceil(totalItems / itemsPerSlide) - 1;

        if (direction === 'next') {
            setIndex(currentIndex < maxIndex ? currentIndex + 1 : 0);
        } else {
            setIndex(currentIndex > 0 ? currentIndex - 1 : maxIndex);
        }
    };

    const hallOfFameUsers = [
        {
            id: 1,
            rank: 1,
            nickname: 'rank111',
            profileImage:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWzYXkVFhflifovTly-AUwXvU5clKQDybxow&s',
            weeklyReviews: 11,
            averageRating: 4.8,
        },
        {
            id: 2,
            rank: 2,
            nickname: 'rank222',
            profileImage:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWzYXkVFhflifovTly-AUwXvU5clKQDybxow&s',
            weeklyReviews: 222,
            averageRating: 4.8,
        },
        {
            id: 3,
            rank: 3,
            nickname: 'rank333',
            profileImage:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWzYXkVFhflifovTly-AUwXvU5clKQDybxow&s',
            weeklyReviews: 5000,
            averageRating: 4.8,
        },
    ];

    return (
        <div className='main-container'>
            {/* 명예의 전당 섹션 */}
            <section className='main-hall-of-fame-section'>
                <h2 className='main-section-title'>명예의 전당</h2>
                <div className='main-hall-of-fame-content'>
                    {hallOfFameUsers.map((user) => (
                        <div key={user.id} className={`main-hall-of-fame-container rank-${user.rank}`}>
                            <div className='main-hall-of-fame-card'>
                                <div className='main-user-profile'>
                                    <div className='main-profile-header'>
                                        <span className='main-rank-number'>{user.rank}</span>
                                    </div>
                                    <div className='main-profile-content'>
                                        <div className='main-profile-info'>
                                            <div className='main-profile-image-container'>
                                                <img
                                                    src={user.profileImage}
                                                    alt={`${user.nickname} 프로필`}
                                                    className='main-profile-image'
                                                />
                                                <div className='main-medal-container'>
                                                    <img
                                                        src={
                                                            user.rank === 1
                                                                ? '/images/main/icon-medal-gold.svg'
                                                                : user.rank === 2
                                                                ? '/images/main/icon-medal-silver.svg'
                                                                : '/images/main/icon-medal-bronze.svg'
                                                        }
                                                        alt='메달'
                                                        className='main-medal-image'
                                                    />
                                                </div>
                                            </div>
                                            <div className='main-user-details'>
                                                <h3 className='main-user-nickname'>{user.nickname}</h3>
                                                <div className='main-user-stats'>
                                                    <div className='main-stat-item'>
                                                        <img
                                                            src='/images/main/uil-calender.svg'
                                                            alt='캘린더'
                                                            className='main-stat-icon'
                                                        />
                                                        <span className='main-stat-label'>이번 주 리뷰: </span>
                                                        <span className='main-stat-value'>{user.weeklyReviews}개</span>
                                                    </div>
                                                    <div className='main-stat-item'>
                                                        <img
                                                            src='/images/main/star.svg'
                                                            alt='별점'
                                                            className='main-stat-icon'
                                                        />
                                                        <span className='main-stat-label'>평균 별점: </span>
                                                        <span className='main-stat-value'>{user.averageRating} 점</span>
                                                    </div>
                                                    <div className='main-rank-badge'>
                                                        <span className='main-rank-text'>#{user.rank}위</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='main-podium'>
                                <span className='main-podium-number'>{user.rank}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 구분선 */}
            <div className='main-section-divider'></div>

            {/* 인기 상품 섹션 */}
            <section className='main-products-section'>
                <h2 className='main-section-title'>인기 상품</h2>
                <div className='main-products-content'>
                    <div className='main-products-grid'>
                        <div
                            className='main-products-slider'
                            style={{
                                transform: `translateX(-${popularSlideIndex * slideDistance * itemsPerSlide}px)`,
                            }}
                        >
                            {popularProducts.map((product) => (
                                <ProductCard key={product.id} product={product} size='size1' />
                            ))}
                        </div>
                    </div>
                    <div className='main-navigation-arrows'>
                        <button
                            className='main-nav-arrow left'
                            disabled={popularSlideIndex === 0}
                            onClick={() =>
                                handleSlide('prev', popularSlideIndex, setPopularSlideIndex, popularProducts.length)
                            }
                        >
                            <img src='/images/main/arrow-left.svg' alt='이전' />
                        </button>
                        <button
                            className='main-nav-arrow right'
                            disabled={popularSlideIndex >= Math.ceil(popularProducts.length / itemsPerSlide) - 1}
                            onClick={() =>
                                handleSlide('next', popularSlideIndex, setPopularSlideIndex, popularProducts.length)
                            }
                        >
                            <img src='/images/main/arrow-right.svg' alt='다음' />
                        </button>
                    </div>
                </div>
            </section>

            {/* 구분선 */}
            <div className='main-section-divider'></div>

            {/* 추천 상품 섹션 */}
            <section className='main-products-section'>
                <h2 className='main-section-title'>추천 상품</h2>
                <div className='main-products-content'>
                    <div className='main-products-grid'>
                        <div
                            className='main-products-slider'
                            style={{
                                transform: `translateX(-${recommendedSlideIndex * slideDistance * itemsPerSlide}px)`,
                            }}
                        >
                            {recommendedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} size='size1' />
                            ))}
                        </div>
                    </div>
                    <div className='main-navigation-arrows'>
                        <button
                            className='main-nav-arrow left'
                            disabled={recommendedSlideIndex === 0}
                            onClick={() =>
                                handleSlide(
                                    'prev',
                                    recommendedSlideIndex,
                                    setRecommendedSlideIndex,
                                    recommendedProducts.length
                                )
                            }
                        >
                            <img src='/images/main/arrow-left.svg' alt='이전' />
                        </button>
                        <button
                            className='main-nav-arrow right'
                            disabled={
                                recommendedSlideIndex >= Math.ceil(recommendedProducts.length / itemsPerSlide) - 1
                            }
                            onClick={() =>
                                handleSlide(
                                    'next',
                                    recommendedSlideIndex,
                                    setRecommendedSlideIndex,
                                    recommendedProducts.length
                                )
                            }
                        >
                            <img src='/images/main/arrow-right.svg' alt='다음' />
                        </button>
                    </div>
                </div>
            </section>

            {/* 구분선 */}
            <div className='main-section-divider'></div>

            {/* 신규 상품 섹션 */}
            <section className='main-products-section'>
                <h2 className='main-section-title'>신규 상품</h2>
                <div className='main-products-content'>
                    <div className='main-products-grid'>
                        <div
                            className='main-products-slider'
                            style={{
                                transform: `translateX(-${newSlideIndex * slideDistance * itemsPerSlide}px)`,
                            }}
                        >
                            {newProducts.map((product) => (
                                <ProductCard key={product.id} product={product} size='size1' />
                            ))}
                        </div>
                    </div>
                    <div className='main-navigation-arrows'>
                        <button
                            className='main-nav-arrow left'
                            disabled={newSlideIndex === 0}
                            onClick={() => handleSlide('prev', newSlideIndex, setNewSlideIndex, newProducts.length)}
                        >
                            <img src='/images/main/arrow-left.svg' alt='이전' />
                        </button>
                        <button
                            className='main-nav-arrow right'
                            disabled={newSlideIndex >= Math.ceil(newProducts.length / itemsPerSlide) - 1}
                            onClick={() => handleSlide('next', newSlideIndex, setNewSlideIndex, newProducts.length)}
                        >
                            <img src='/images/main/arrow-right.svg' alt='다음' />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
