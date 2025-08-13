"use client";

import React, { useState } from "react";
import "../css/MyReviewList.css";
import MyReviewPage from "./MyReviewDetail";

const mockReviews = [
    { id: 1, title: "아가 까까 팜", rating: 5, date: "2014년 02월 02일", image: "https://i.namu.wiki/i/Hv0V4WWCm_FEi9CgeCx6B59r4WXsbx8rw42vpmwtge33R0d5qOrmU9Ys8ly7aEuCs7yKRz4QaQk53vL1ZoXO4w.webp" },
    { id: 2, title: "분유 사실분!~", rating: 5, date: "2020년 10월 30일", image: "https://direct.maeil.com/UploadedFiles/direct/product/16384cfd-f0df-41d0-ba74-adeb175f2538.jpg" },
    { id: 3, title: "오징어 인형 팔아요", rating: 5, date: "2023년 02월 11일", image: "https://i.namu.wiki/i/CJ26nMlkCYi6VK26GJW7fQ6Eh9DjuYXMK4vZXYx8CQIElySFfd8AU_MbFxkCkoK23uFv7DZ3Wwa3qNePlaCkRQ.webp" },
    { id: 4, title: "버섯 장난감 판매합니다", rating: 5, date: "2003년 03월 02일", image: "https://cdn.psnews.co.kr/news/photo/202404/2051984_101923_2627.jpg" },
];

export default function MyReviewList({ open, onClose }) {
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [animateClass, setAnimateClass] = useState("animate-slide-in");

    if (!open) return null;

    const handleClose = () => {
        setAnimateClass("animate-slide-out");
        setTimeout(() => {
            onClose();
            setAnimateClass("animate-slide-in"); // 다음 열 때 다시 슬라이드 인
        }, 300); // 애니메이션 시간과 동일하게
    };

    return (
        <>
            {/* 배경 오버레이 */}
            <div
                className="overlay-background"
                // style={{ zIndex: 150 }}
                onClick={handleClose}
            ></div>

            {/* 사이드바 */}
            <div
                className={`review-sidebar ${animateClass}`}
                style={{
                    // zIndex: 150,
                    position: "fixed",
                    top: 0,
                    right: 0
                }}
            >
                <div className="sidebar-header">
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
                    <h2 className="sidebar-title">나의 리뷰 내역</h2>
                </div>

                {detailOpen && selectedReview ? (
                    <MyReviewPage
                        review={selectedReview}
                        onClose={() => setDetailOpen(false)}
                    />
                ) : (
                    <div className="review-list">
                        {mockReviews.map((review) => (
                            <div key={review.id} className="review-item">
                                <div className="review-image">
                                    <img
                                        src={review.image}
                                        alt={review.title}
                                        className="product-image"
                                    />
                                </div>
                                <div className="review-content relative">
                                    <a
                                        href="#"
                                        className="review-detail-link absolute top-0 right-0"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSelectedReview(review);
                                            setDetailOpen(true);
                                        }}
                                    >
                                        리뷰 상세
                                    </a>
                                    <h3 className="product-title">{review.title}</h3>
                                    <p className="review-date">{review.date}</p>
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
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
