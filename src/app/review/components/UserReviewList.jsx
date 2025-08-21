'use client';

import React, { useState, useEffect } from 'react';
import '../css/UserReviewList.css';
import UserReviewDetail from './UserReviewDetail';

const UserReviewList = ({ onClose, open }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [showReviewDetail, setShowReviewDetail] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0, positiveReviews: 0, negativeReviews: 0 });
    const [positiveSummary, setPositiveSummary] = useState(''); // 긍정 종합 요약
    const [negativeSummary, setNegativeSummary] = useState(''); // 부정 종합 요약

    useEffect(() => {
        if (open) {
            const fetchData = async () => {
                try {
                    // 1. 모든 리뷰와 통계 데이터 가져오기 (기존)
                    const reviewsResponse = await fetch('http://localhost:8000/api/v1/review-service/reviews');
                    const statsResponse = await fetch('http://localhost:8000/api/v1/review-service/reviews/status');

                    if (!reviewsResponse.ok || !statsResponse.ok) {
                        throw new Error('Failed to fetch data');
                    }

                    const reviewsData = await reviewsResponse.json();
                    const statsData = await statsResponse.json();

                    setReviews(reviewsData.data);
                    setStats(statsData.data);

                    // 2. 새로운 API 호출: 종합 긍정 리뷰 요약 가져오기
                    const positiveSummaryResponse = await fetch('http://localhost:8000/api/v1/review-service/reviews/summary?sentiment=positive');
                    const positiveSummaryData = await positiveSummaryResponse.json();
                    if (positiveSummaryData.success) {
                        setPositiveSummary(positiveSummaryData.data);
                    } else {
                        setPositiveSummary('긍정 리뷰 요약을 가져오지 못했습니다.');
                    }

                    // 3. 새로운 API 호출: 종합 부정 리뷰 요약 가져오기
                    const negativeSummaryResponse = await fetch('http://localhost:8000/api/v1/review-service/reviews/summary?sentiment=negative');
                    const negativeSummaryData = await negativeSummaryResponse.json();
                    if (negativeSummaryData.success) {
                        setNegativeSummary(negativeSummaryData.data);
                    } else {
                        setNegativeSummary('부정 리뷰 요약을 가져오지 못했습니다.');
                    }

                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };
            fetchData();
        }
    }, [open]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 300);
    };

    const handleFilterClick = (filterType) => {
        setActiveFilter(filterType);
    };

    const handleReviewDetailOpen = (review) => {
        setSelectedReview({ ...review, image: review.img });
        setShowReviewDetail(true);
    };

    const handleReviewDetailClose = () => {
        setShowReviewDetail(false);
        setSelectedReview(null);
    };

    const filteredReviews = reviews.filter(review => {
        if (activeFilter === 'all') {
            return true;
        }
        if (activeFilter === 'positive') {
            return review.summary && review.summary.includes('긍정적');
        }
        if (activeFilter === 'negative') {
            return review.summary && review.summary.includes('부정적');
        }
        return true;
    });

    if (!open && !isClosing) {
        return null;
    };

    return (
        <>
            <div className="user-review-backdrop" onClick={handleClose}></div>
            <aside className={`user-review-sidebar ${isClosing ? 'animate-slide-out' : 'animate-slide-in'}`}>
                <div className="user-review-top">
                    <button className="back-button" onClick={handleClose}>
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="black"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                    <h2 className="review-title">"멋진맘"님의 거래 리뷰 내역</h2>
                </div>

                <div className="average-rating-box">
                    <div className="positive-negative-reviews">
                        <div className="review-category-card">
                            <p className="category-title positive">긍정적 리뷰 {stats.positiveReviews}개</p>
                            <p className="category-content">
                                {positiveSummary}
                            </p>
                        </div>
                        <div className="review-category-card">
                            <p className="category-title negative">부정적 리뷰 {stats.negativeReviews}개</p>
                            <p className="category-content">
                                {negativeSummary}
                            </p>
                        </div>
                    </div>
                    <p>"멋진맘"의 총 별점 평균과 총 리뷰 개수는</p>
                    <div className="big-stars">
                        {[1, 2, 3, 4, 5].map((starIndex) => (
                            <span key={starIndex} className="big-star-wrapper">
                                <span className="big-star-background">★</span>
                                {stats.averageRating >= starIndex ? (
                                    <span className="big-star-foreground full">★</span>
                                ) : (
                                    stats.averageRating >= starIndex - 0.5 ? (
                                        <span className="big-star-foreground half">★</span>
                                    ) : null
                                )}
                            </span>
                        ))}
                    </div>
                    <div className="rating-summary">
                        {stats.averageRating.toFixed(1)} / {stats.totalReviews}개
                    </div>

                </div>

                <div className="review-filters-container">
                    <div className="review-filters">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="filter-icon"
                        >
                            <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" />
                        </svg>
                        <button
                            className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
                            onClick={() => handleFilterClick('all')}
                        >
                            전체
                        </button>
                        <button
                            className={`filter-button ${activeFilter === 'positive' ? 'active' : ''}`}
                            onClick={() => handleFilterClick('positive')}
                        >
                            긍정
                        </button>
                        <button
                            className={`filter-button ${activeFilter === 'negative' ? 'active' : ''}`}
                            onClick={() => handleFilterClick('negative')}
                        >
                            부정
                        </button>
                    </div>
                </div>

                <div className="review-list">
                    {filteredReviews.map((review) => (
                        <div
                            className="review-card"
                            key={review.reviewId}
                        >
                            <img src={review.img} alt={review.title} className="product-thumb" />
                            <div className="review-info">
                                <h3 className="product-title">상품명은 추후 추가</h3>
                                <p className="review-date">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                                <div className="review-stars">
                                    {[1, 2, 3, 4, 5].map((starIndex) => (
                                        <span
                                            key={starIndex}
                                            className="star-wrapper"
                                        >
                                            <span className="star-background">★</span>
                                            {review.rating >= starIndex ? (
                                                <span className="star-foreground full">★</span>
                                            ) : (
                                                review.rating >= starIndex - 0.5 ? (
                                                    <span className="star-foreground half">★</span>
                                                ) : null
                                            )}
                                        </span>
                                    ))}
                                </div>
                                <div className="comment-text-box">
                                    <p className="review-comment">{review.summary}</p>
                                </div>
                            </div>
                            <button
                                className="userreview-detail-link"
                                onClick={() => handleReviewDetailOpen(review)}
                            >
                                리뷰 상세
                            </button>
                        </div>
                    ))}
                </div>
            </aside>
            {selectedReview && (
                <UserReviewDetail
                    review={selectedReview}
                    onClose={handleReviewDetailClose}
                    open={showReviewDetail}
                />
            )}
        </>
    );
};

export default UserReviewList;