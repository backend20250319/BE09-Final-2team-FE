'use client';

import React, { useState } from 'react';
import './Myreviewmainpage.css';
import Sidebar from '@/components/common/Sidebar';
import { Button } from '@/components/ui/button';
import 

const mockReviews = [
    { id: 1, title: '아가 까까 팜', rating: 5, date: '2014년 02월 02일', image: 'https://i.namu.wiki/i/Hv0V4WWCm_FEi9CgeCx6B59r4WXsbx8rw42vpmwtge33R0d5qOrmU9Ys8ly7aEuCs7yKRz4QaQk53vL1ZoXO4w.webp' },
    { id: 2, title: '분유 사실분!~', rating: 5, date: '2020년 10월 30일', image: 'https://direct.maeil.com/UploadedFiles/direct/product/16384cfd-f0df-41d0-ba74-adeb175f2538.jpg' },
    { id: 3, title: '오징어 인형 팔아요', rating: 5, date: '2023년 02월 11일', image: 'https://i.namu.wiki/i/CJ26nMlkCYi6VK26GJW7fQ6Eh9DjuYXMK4vZXYx8CQIElySFfd8AU_MbFxkCkoK23uFv7DZ3Wwa3qNePlaCkRQ.webp' },
    { id: 4, title: '버섯 장난감 판매합니다', rating: 5, date: '2003년 03월 02일', image: 'https://cdn.psnews.co.kr/news/photo/202404/2051984_101923_2627.jpg' },
];

const MyReviewMainPage = () => {

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
