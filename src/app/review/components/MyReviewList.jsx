'use client';

import React, { useState, useEffect } from 'react';
import '../css/MyReviewList.css';
import MyReviewDetail from './MyReviewDetail';

export default function MyReviewList({ open, onClose }) {
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [animateClass, setAnimateClass] = useState("animate-slide-in");
    const [detailAnimateClass, setDetailAnimateClass] = useState("animate-slide-in");
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        if (open) {
            const fetchReviews = async () => {
                try {
                    const response = await fetch('http://localhost:8000/api/v1/review-service/reviews');
                    if (!response.ok) throw new Error('Failed to fetch reviews');
                    const data = await response.json();
                    setReviews(data.data);
                } catch (error) {
                    console.error("Error fetching reviews:", error);
                    setReviews([]);
                }
            };
            fetchReviews();
        }
    }, [open]);

    if (!open) return null;

    const handleClose = () => {
        setAnimateClass("animate-slide-out");
        setTimeout(() => {
            onClose();
            setAnimateClass("animate-slide-in");
        }, 300);
    };

    const handleReviewDetailOpen = (review) => {
        setSelectedReview(review);
        setDetailOpen(true);
    };

    const handleReviewDetailClose = () => {
        setDetailAnimateClass("animate-slide-out");
        setTimeout(() => {
            setDetailOpen(false);
            setDetailAnimateClass("animate-slide-in");
        }, 300);
    };

    const handleOverlayClick = () => {
        if (detailOpen) {
            handleReviewDetailClose();
        } else {
            handleClose();
        }
    };

    return (
        <>
            {/* 오버레이는 두 사이드바 공용 */}
            <div className="overlay-background" onClick={handleOverlayClick}></div>

            {/* 리스트 사이드바 */}
            <div className={`review-sidebar ${animateClass}`}>
                <div className="sidebar-header">
                    <button className="back-button" onClick={handleClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                    <h2 className="sidebar-title">나의 리뷰 내역</h2>
                </div>

                <div className="review-list">
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review.reviewId} className="review-item">
                                <div className="review-image">
                                    <img
                                        src={review.image || "https://via.placeholder.com/100"}
                                        alt={review.title || "상품 이미지"}
                                        className="product-image"
                                    />
                                </div>
                                <div className="review-content relative">
                                    <a
                                        href="#"
                                        className="review-detail-link absolute top-0 right-0"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleReviewDetailOpen(review);
                                        }}
                                    >
                                        리뷰 상세
                                    </a>
                                    <h3 className="product-title">{review.title || "상품명은 추후 추가"}</h3>
                                    <p className="review-date">{new Date(review.createdAt).toLocaleDateString()}</p>
                                    <div className="review-stars">
                                        {[...Array(5)].map((_, index) => (
                                            <span
                                                key={index}
                                                className={`star ${index < review.rating ? "active" : ""}`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>작성된 리뷰가 없습니다.</p>
                    )}
                </div>
            </div>

            {/* 상세 사이드바 - 리스트 사이드바 밖에서 렌더링 */}
            {detailOpen && selectedReview && (
                <MyReviewDetail
                    review={selectedReview}
                    onClose={handleReviewDetailClose}
                    animateClass={detailAnimateClass}
                />
            )}
        </>
    );
}
