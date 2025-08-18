import React, { useState } from 'react';
import '../css/UserReviewDetail.css';

const UserReviewDetail = ({ review, onClose }) => {
    const [animateClass, setAnimateClass] = useState('animate-slide-in');

    const handleClose = () => {
        setAnimateClass('animate-slide-out');
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const [reviewData, setReviewData] = useState({
        ...review,
        reviewDetails: [
            '상대가 친절했어요.',
            '상대가 약속을 잘 지켰어요.',
            '상품 상태가 좋아요.',
        ],
        reviewText: '아이도 좋아하고 상태도 매우 좋았습니다. 감사합니다!',
    });

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
                    <h1 className="sidebar-title">00의 상세 리뷰 내역</h1>
                </div>

                <div className="review-detail-content">
                    <div className="product-summary">
                        <div className="product-image-container">
                            <img src={reviewData.image} alt={reviewData.title} className="product-image" />
                        </div>
                        <div className="product-info">
                            <h2 className="product-title">{reviewData.title}</h2>
                            <p className="review-date">{reviewData.date}</p>
                            <div className="star-rating">
                                {[1, 2, 3, 4, 5].map((num) => {
                                    const isFull = reviewData.rating >= num;
                                    const isHalf = reviewData.rating >= num - 0.5 && reviewData.rating < num;
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
                        {reviewData.reviewDetails.map((item, idx) => (
                            <div key={idx} className="review-detail-item">
                                <span className="detail-text">{item}</span>
                            </div>
                        ))}
                    </div>

                    <div className="review-text-container">
                        <div className="review-text-area">
                            <p className="review-text">{reviewData.reviewText}</p>
                            <div className="character-count">{reviewData.reviewText.length}/1000</div>
                        </div>
                    </div>
                </div>
            </aside>

        </>
    );
};

export default UserReviewDetail;
