'use client';

import React, { useState } from 'react';
import './Myreviewmainpage.css';
import Sidebar from '@/components/common/Sidebar';
import { Button } from '@/components/ui/button';

const mockReviews = [
    { id: 1, title: '아가 까까 팜', rating: 5, date: '2014년 02월 02일', image: '/images/review/cookie.webp' },
    { id: 2, title: '분유 사실분!~', rating: 5, date: '2020년 10월 30일', image: '/images/review/baby.jpg' },
    { id: 3, title: '오징어 인형 팔아요', rating: 5, date: '2023년 02월 11일', image: '/images/review/fish.webp' },
    { id: 4, title: '버섯 장난감 판매합니다', rating: 5, date: '2003년 03월 02일', image: '/images/review/mush.jpeg' },
];

const MyReviewMainPage = () => {
    const [open, setOpen] = useState(false);

    const handleReviewClick = (reviewTitle) => {
        alert(`'${reviewTitle}' 리뷰 상세 페이지로 이동합니다.`);
    };

    const handleReviewDetailLinkClick = (e, reviewTitle) => {
        e.preventDefault();
        e.stopPropagation();
        alert(`'${reviewTitle}' 리뷰 상세 페이지로 이동합니다.`);
    };

    return (
        <div className="page-container">
            {/* 사이드바 */}
            <Sidebar
                title="나의 리뷰 내역"
                open={open}
                onClose={() => setOpen(false)}
                trigger={
                    <Button onClick={() => setOpen(true)} variant="default">
                        나의 리뷰 열기
                    </Button>
                }
                titleClassName="text-xl font-bold text-center"
                width="max-w-[600px]"
            >
                <div className="review-list">
                    {mockReviews.map((review) => (
                        <div
                            key={review.id}
                            className="review-item"
                            onClick={() => handleReviewClick(review.title)}
                        >
                            <div className="review-image">
                                <img src={review.image} alt={review.title} className="product-image" />
                            </div>

                            <div className="review-content relative">
                                {/* 오른쪽 상단 링크 */}
                                <a
                                    href="#"
                                    className="review-detail-link absolute top-0 right-0"
                                    onClick={(e) => handleReviewDetailLinkClick(e, review.title)}
                                >
                                    리뷰 상세
                                </a>

                                <h3 className="product-title">{review.title}</h3>
                                <p className="review-date">{review.date}</p>
                                <div className="review-stars">
                                    {[...Array(5)].map((_, index) => (
                                        <span
                                            key={index}
                                            className={`star ${index < review.rating ? 'active' : ''}`}
                                        >
                      ★
                    </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Sidebar>
        </div>
    );
};

export default MyReviewMainPage;
