'use client';

import React, { useState, useEffect } from 'react';
import '../css/MyReviewList.css';
import MyReviewDetail from './MyReviewDetail';
import { reviewAPI } from '@/lib/api';
import { useUser } from '@/store/userStore';

export default function MyReviewList({ open, onClose, user }) {
    const currentUser = useUser();
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [animateClass, setAnimateClass] = useState("animate-slide-in");
    const [detailAnimateClass, setDetailAnimateClass] = useState("animate-slide-in");
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        if (open) {
            const fetchReviews = async () => {
                try {
                    const { data } = await reviewAPI.getMyReviews();
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

    // 이 함수를 수정하여 review와 index를 모두 받도록 변경합니다.
    const handleReviewDetailOpen = (review, index) => {
        // 이미지와 상품명 배열을 정의합니다.
        const imageFiles = ['test.jpg', 'baby1.png', 'toy.png','ball.png','toy1.png','zh.png'];
        const productTitles = ['유아용 옷', '소베맘 귀저기갈이대', '장난감','에듀볼','아기 모빌','소독기'];

        // index를 이용해 순서에 맞는 이미지와 상품명을 선택합니다.
        const imageFileName = imageFiles[index % imageFiles.length];
        const imagePath = `/images/${imageFileName}`;
        const productTitle = productTitles[index % productTitles.length];

        // 선택된 리뷰 객체에 이미지와 상품명 정보를 추가합니다.
        const updatedReview = {
            ...review,
            image: imagePath,
            title: productTitle
        };

        setSelectedReview(updatedReview);
        setDetailOpen(true);
    };


    const handleReviewDetailClose = () => {
        setDetailAnimateClass("animate-slide-out");
        setTimeout(() => {
            setDetailOpen(false);
            setDetailAnimateClass("animate-slide-in");
        }, 300);
    };

    const handleReviewUpdate = (updatedReview) => {
        setReviews((prev) =>
            prev.map((r) =>
                r.reviewId === updatedReview.reviewId ? updatedReview : r
            )
        );
        setSelectedReview(updatedReview);
    };

    const handleOverlayClick = () => {
        const editSidebar = document.querySelector(".review-edit-sidebar");
        if (editSidebar) {
            editSidebar.classList.add("animate-slide-out");
            setTimeout(() => {
                const closeButton = editSidebar.querySelector(".back-button");
                if (closeButton) closeButton.click();
            }, 300);
            return;
        }
        if (detailOpen) {
            handleReviewDetailClose();
            return;
        }
        handleClose();
    };

    return (
        <>
            <div className="overlay-background" onClick={handleOverlayClick}></div>

            <div className={`review-sidebar ${animateClass}`}>
                <div className="sidebar-header">
                    <button className="back-button" onClick={handleClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                    <h2 className="sidebar-title">나의 리뷰 내역</h2>
                </div>

                <div className={`review-list ${reviews.length === 0 ? 'empty-state' : ''}`}>
                    {reviews.length > 0 ? (
                        reviews.map((review, index) => {
                            const imageFiles = ['test.jpg', 'baby1.png', 'toy.png','ball.png','toy1.png','zh.png'];
                            const imageFileName = imageFiles[index % imageFiles.length];
                            const imagePath = `/images/${imageFileName}`;

                            const productTitles = ['유아용 옷', '소베맘 귀저기갈이대', '장난감','에듀볼','아기 모빌','소독기'];
                            const productTitle = productTitles[index % productTitles.length];
                            return (
                                <div key={review.reviewId} className="review-item">
                                    <div className="review-image">
                                        <img
                                            src={imagePath}
                                            alt={productTitle}
                                            className="product-image"
                                        />
                                    </div>
                                    <div className="review-content relative">
                                        <a
                                            href="#"
                                            className="review-detail-link absolute top-0 right-0"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                // 여기에서 index를 handleReviewDetailOpen에 전달합니다.
                                                handleReviewDetailOpen(review, index);
                                            }}
                                        >
                                            리뷰 상세
                                        </a>
                                        <h3 className="product-title">{productTitle}</h3>
                                        <p className="review-date">{new Date(review.createdAt).toLocaleDateString()}</p>
                                        <div className="review-stars">
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
                                        <div className="review-options">
                                            {review.kind && <span className="review-badge kind-badge">친절해요</span>}
                                            {!review.kind && <span className="review-badge unkind-badge">불친절해요</span>}
                                            {review.promise &&
                                                <span className="review-badge promise-badge">약속을 잘 지켜요</span>}
                                            {!review.promise &&
                                                <span className="review-badge unpromised-badge">약속을 안 지켜요</span>}
                                            {review.satisfaction &&
                                                <span className="review-badge satisfaction-badge">만족해요</span>}
                                            {!review.satisfaction &&
                                                <span className="review-badge unsatisfaction-badge">불만족스러워요</span>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p>작성된 리뷰가 없습니다.</p>
                    )}
                </div>
            </div>

            {detailOpen && selectedReview && (
                <MyReviewDetail
                    review={selectedReview}
                    onClose={handleReviewDetailClose}
                    onSave={handleReviewUpdate}
                    animateClass={detailAnimateClass}
                    user={user || currentUser}
                />
            )}
        </>
    );
}