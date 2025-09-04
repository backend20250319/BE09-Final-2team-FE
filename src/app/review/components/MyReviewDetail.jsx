'use client';

import React, { useState, useEffect } from 'react';
import '../css/MyReviewDetail.css';
import MyReviewEditForm from './MyReviewEditForm';

export default function MyReviewDetail({ review, onClose, animateClass, onSave: onReviewUpdate, user }) {
    const [editOpen, setEditOpen] = useState(false);
    const [editAnimateClass, setEditAnimateClass] = useState('animate-slide-in');
    const [reviewData, setReviewData] = useState(review);

    const getReviewDetails = (review) => {
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

    const [reviewDetails, setReviewDetails] = useState(getReviewDetails(reviewData));

    useEffect(() => {
        setReviewData(review);
        setReviewDetails(getReviewDetails(review));
    }, [review]);

    const handleEditClose = () => {
        setEditAnimateClass('animate-slide-out');
        setTimeout(() => {
            setEditOpen(false);
            setEditAnimateClass('animate-slide-in');
        }, 300);
    };

    return (
        <>
            {/* 상세 리뷰 사이드바는 항상 렌더링 */}
            <aside className={`review-detail-sidebar ${animateClass}`}>
                <div className="sidebar-header">
                    <button className="back-button" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                    <h1 className="sidebar-title">리뷰 상세</h1>
                </div>

                <div className="review-detail-content">
                    <div className="product-summary">
                        <div className="product-image-container">
                            <img src={reviewData.image || "https://via.placeholder.com/100"} alt={reviewData.title || "상품 이미지"} className="product-image" />
                        </div>
                        <div className="product-info">
                            <h2 className="product-title">{reviewData.title || "상품명은 추후 추가"}</h2>
                            <p className="review-date">{new Date(reviewData.createdAt).toLocaleDateString()}</p>
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
                        {reviewDetails.map((item, idx) => (
                            <div key={idx} className="review-detail-item">
                                <span className="detail-text">{item}</span>
                            </div>
                        ))}
                    </div>

                    <div className="review-text-container">
                        <div className="review-text-area">
                            <p className="review-text">{reviewData.content}</p>
                            <div className="character-count">{reviewData.content.length}/1000</div>
                        </div>
                    </div>

                    <div className="edit-button-container">
                        <button className="edit-button" onClick={() => setEditOpen(true)}>
                            수정 하기
                        </button>
                    </div>
                </div>
            </aside>

            {/* 수정 사이드바는 상세 리뷰 위에 오버레이 */}
            {editOpen && (
                <MyReviewEditForm
                    onClose={handleEditClose}
                    initialRating={reviewData.rating}
                    initialAnswers={{
                        kind: reviewData.kind,
                        promise: reviewData.promise,
                        satisfaction: reviewData.satisfaction,
                    }}
                    initialReviewText={reviewData.content}
                    onSave={(updated) => {
                        const newReviewData = {
                            ...reviewData,
                            rating: updated.rating,
                            content: updated.reviewText,
                            kind: updated.answers.kind,
                            promise: updated.answers.promise,
                            satisfaction: updated.answers.satisfaction,
                        };

                        setReviewData(newReviewData);
                        setReviewDetails(getReviewDetails(newReviewData));

                        // 부모 컴포넌트에 완전한 업데이트 객체를 전달합니다.
                        onReviewUpdate(newReviewData);

                        // handleEditClose();
                    }}
                    reviewId={reviewData.reviewId}
                    animateClass={editAnimateClass}
                    user={user}
                    review={reviewData}
                    pId={reviewData.userId} // 리뷰 작성자 ID를 상대방 ID로 전달
                />
            )}
        </>
    );
}