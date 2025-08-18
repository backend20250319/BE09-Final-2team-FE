'use client';

import React, { useState } from 'react';
import '../css/UserReviewList.css';
import UserReviewDetail from './UserReviewDetail';

const reviews = [
    { title: '오리 뽁뽁이', date: '2000년 00월 00일', img: 'https://asset.m-gs.kr/prod/1079743862/1/550', rating: 5, comment: '좋아요' },
    { title: '스케치북', date: '2000년 00월 00일', img: 'https://bmungu.co.kr/web/product/big/emungu1_4341.jpg', rating: 2, comment: '별로임' },
    { title: '분양 끝났습니다~', date: '2000년 00월 00일', img: 'https://i.namu.wiki/i/oFOhcumUbZ58itrQIMmCTiRBm4OgD5AZDeOgCS6MJKLMAlK5gyZTfFcEFHH_rUNYKV648V4QvzBlzPQUh80Nug.webp', rating: 5, comment: '깔끔해요' },
];

const UserReviewList = ({ onClose, open }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [showReviewDetail, setShowReviewDetail] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
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
// 상세 리뷰 사이드바 열기
    const handleReviewDetailOpen = (review) => {
        setSelectedReview({ ...review, image: review.img });
        setShowReviewDetail(true);
    };

    // 상세 리뷰 사이드바 닫기
    const handleReviewDetailClose = () => {
        setShowReviewDetail(false);
        setSelectedReview(null);
    };
    const filteredReviews = reviews.filter(review => {
        if (activeFilter === 'all') {
            return true;
        }
        if (activeFilter === 'positive') {
            return review.rating >= 3;
        }
        if (activeFilter === 'negative') {
            return review.rating < 3;
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
                    <p>"멋진맘"의 총 별점 평균과 총 리뷰 개수는</p>
                    <div className="big-stars">★★★★★</div>
                    <div className="rating-summary">5.0 / 120개</div>

                    <div className="positive-negative-reviews">
                        <div className="review-category-card">
                            <p className="category-title positive">긍정적 리뷰 2개</p>
                            <p className="category-content">
                                고객들이 서비스 품질과 직원의 친절함에 대해 높이 평가하고 있습니다. 특히 빠른 배송과 제품의 품질에 대한 만족도가 높으며, 재구매 의사를 표현하는 고객들이 많습니다.
                            </p>
                        </div>
                        <div className="review-category-card">
                            <p className="category-title negative">부정적 리뷰 1개</p>
                            <p className="category-content">
                                일부 고객들이 배송 지연과 고객 서비스 응답 속도에 대해 아쉬움을 표현했습니다. 제품 포장 상태와 일부 품질 이슈에 대한 개선이 필요해 보입니다..
                            </p>
                        </div>
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
                    {filteredReviews.map((review, index) => (
                        <div
                            className="review-card"
                            key={index}
                        >
                            <img src={review.img} alt={review.title} className="product-thumb" />
                            <div className="review-info">
                                <h3 className="product-title">{review.title}</h3>
                                <p className="review-date">{review.date}</p>
                                <div className="review-stars">
                                    {'★★★★★'.split('').map((_, i) => (
                                        <span key={i} className={i < review.rating ? 'star active' : 'star'}>★</span>
                                    ))}
                                </div>
                                <div className="comment-text-box">
                                    <p className="review-comment">{review.comment}</p>
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