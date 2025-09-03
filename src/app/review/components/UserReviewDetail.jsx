'use client';

import React, { useState, useEffect } from 'react';
import '../css/UserReviewDetail.css';

const UserReviewDetail = ({ review, onClose, user }) => {
    const [animateClass, setAnimateClass] = useState('animate-slide-in');

    const handleClose = () => {
        setAnimateClass('animate-slide-out');
        setTimeout(() => {
            onClose();
        }, 300);
    };

    // 리뷰 상세 항목을 동적으로 생성하는 함수
    const getReviewDetails = () => {
        const details = [];
        if (review.kind !== undefined && review.kind !== null) {
            details.push(review.kind ? '상대가 친절했어요.' : '상대가 친절하지 않았어요.');
        }
        if (review.promise !== undefined && review.promise !== null) {
            details.push(review.promise ? '상대가 약속을 잘 지켰어요.' : '상대가 약속을 지키지 않았어요.');
        }
        if (review.satisfaction !== undefined && review.satisfaction !== null) {
            details.push(review.satisfaction ? '상품 상태가 좋아요.' : '상품 상태가 좋지 않아요.');
        }
        return details;
    };

    const reviewDetailsItems = getReviewDetails();
    const reviewTextContent = review.content || ''; // content가 없을 경우 빈 문자열로 처리

    return (
        <>
            <div className="user-review-detail-backdrop" onClick={handleClose}></div>
            <aside className={`review-detail-sidebar ${animateClass}`}>
                <div className="sidebar-header">
                    <button className="back-button" onClick={handleClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                    <h1 className="sidebar-title">"{user?.nickname || '구매자'}"의 상세 리뷰</h1>
                </div>

                <div className="review-detail-content">
                    <div className="product-summary">
                        <div className="product-image-container">
                            <img src={review.img} alt={review.title} className="product-image" />
                        </div>
                        <div className="product-info">
                            <h2 className="product-title">상품명은 추후 추가</h2>
                            <p className="review-date">{new Date(review.createdAt).toLocaleDateString()}</p>
                            <div className="star-rating">
                                {[1, 2, 3, 4, 5].map((num) => {
                                    const isFull = review.rating >= num;
                                    const isHalf = review.rating >= num - 0.5 && review.rating < num;
                                    return (
                                        <span key={num} className="star-wrapper">
                                            <span className="star-background">★</span>
                                            {isFull ? (
                                                <span className="star-foreground full">★</span>
                                            ) : isHalf ? (
                                                <span className="star-foreground half">★</span>
                                            ) : null}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="review-details">
                        {reviewDetailsItems.map((item, idx) => (
                            <div key={idx} className="review-detail-item">
                                <span className="detail-text">{item}</span>
                            </div>
                        ))}
                    </div>

                    <div className="review-text-container">
                        <div className="review-text-area">
                            <p className="review-text">{reviewTextContent}</p>
                            <div className="character-count">{reviewTextContent.length}/1000</div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default UserReviewDetail;