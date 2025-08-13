'use client';

import React, { useEffect, useState } from 'react';
import '../css/UserReviewList.css';

const reviews = [
    { title: '오리 뽁뽁이', date: '2000년 00월 00일', img: 'https://asset.m-gs.kr/prod/1079743862/1/550', rating: 5 },
    { title: '스케치북', date: '2000년 00월 00일', img: 'https://bmungu.co.kr/web/product/big/emungu1_4341.jpg', rating: 5 },
    { title: '분양 끝났습니다~', date: '2000년 00월 00일', img: 'https://i.namu.wiki/i/oFOhcumUbZ58itrQIMmCTiRBm4OgD5AZDeOgCS6MJKLMAlK5gyZTfFcEFHH_rUNYKV648V4QvzBlzPQUh80Nug.webp', rating: 5 },
];

const UserReviewList = ({ onClose, open }) => {
    const [isClosing, setIsClosing] = useState(false);

    // useEffect(() => {
    //     const handleEsc = (e) => {
    //         if (e.key === "Escape") handleClose();
    //     };
    //     document.addEventListener("keydown", handleEsc);
    //     return () => document.removeEventListener("keydown", handleEsc);
    // }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 300);
    };

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
                </div>

                <div className="review-list">
                    {reviews.map((review, index) => (
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
                            </div>
                        </div>
                    ))}
                </div>
            </aside>
        </>
    );
};

export default UserReviewList;
