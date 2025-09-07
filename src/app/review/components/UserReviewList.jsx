'use client';

import React, { useState, useEffect } from 'react';
import '../css/UserReviewList.css';
import UserReviewDetail from './UserReviewDetail';
import { reviewAPI, userAPI } from '@/lib/api';

const UserReviewList = ({ onClose, open, pId }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [showReviewDetail, setShowReviewDetail] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0, positiveReviews: 0, negativeReviews: 0 });
    const [positiveSummary, setPositiveSummary] = useState('');
    const [negativeSummary, setNegativeSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [targetNickname, setTargetNickname] = useState('사용자');
    const [userId, setUserId] = useState(null);

    // 상품에서 판매자 ID 가져오기
    useEffect(() => {
        if (!pId) return;

        const fetchSellerId = async () => {
            try {
                const productRes = await reviewAPI.getProductInfo(pId);
                const productData = productRes.data?.data;
                console.log("상품 상세:", productData);

                // 응답 구조에 따라 sellerId 추출
                const resolvedSellerId = productData?.product?.sellerId || productData?.sellerInfo?.id;
                console.log("Resolved Seller ID:", resolvedSellerId);
                setUserId(resolvedSellerId);

                // 닉네임도 바로 가져오기
                if (resolvedSellerId) {
                    const res = await userAPI.getUserInfo(resolvedSellerId);
                    setTargetNickname(res.data?.data?.nickname || `사용자 ${resolvedSellerId}`);
                }
            } catch (err) {
                console.error("판매자 정보 가져오기 실패:", err);
            }
        };

        fetchSellerId();
    }, [pId]);

    // 리뷰 및 통계 데이터 가져오기
    useEffect(() => {
        if (!open || !userId) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const reviewsResponse = await reviewAPI.userReviewList(userId);
                const userReviews = reviewsResponse.data?.data || [];
                setReviews(userReviews);

                const statsResponse = await reviewAPI.getReviewStatsForUser(userId);
                const statData = statsResponse.data?.data || {};
                setStats({
                    averageRating: statData.averageRating || 0,
                    totalReviews: statData.totalReviews || userReviews.length,
                    positiveReviews: statData.positiveReviews || userReviews.filter(r => r.sentiment === '긍정적').length,
                    negativeReviews: statData.negativeReviews || userReviews.filter(r => r.sentiment === '부정적').length,
                });
                // 요약 가져오기
                try {
                    const posSummaryRes = await reviewAPI.getSummary(null, '긍정적');
                    setPositiveSummary(posSummaryRes.data.data || '긍정적 리뷰가 존재하지 않습니다.');
                } catch {
                    setPositiveSummary('긍정적 리뷰가 존재하지 않습니다.');
                }

                try {
                    const negSummaryRes = await reviewAPI.getSummary(null, '부정적');
                    setNegativeSummary(negSummaryRes.data.data || '부정적 리뷰가 존재하지 않습니다.');
                } catch {
                    setNegativeSummary('부정적 리뷰가 존재하지 않습니다.');
                }
            } catch (error) {
                console.error('리뷰 데이터 가져오기 실패', error);
                setPositiveSummary('긍정적 리뷰가 존재하지 않습니다.');
                setNegativeSummary('부정적 리뷰가 존재하지 않습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [open, userId]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 300);
    };

    const handleFilterClick = (filterType) => setActiveFilter(filterType);

    const handleReviewDetailOpen = (review) => {
        setSelectedReview({ ...review, image: review.img });
        setShowReviewDetail(true);
    };

    const handleReviewDetailClose = () => {
        setShowReviewDetail(false);
        setSelectedReview(null);
    };

    const filteredReviews = reviews.filter(review => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'positive') return review.sentiment === '긍정적';
        if (activeFilter === 'negative') return review.sentiment === '부정적';
        return true;
    });

    if (!open && !isClosing) return null;

    return (
        <>
            <div className="user-review-backdrop" onClick={handleClose}></div>
            <aside className={`user-review-sidebar ${isClosing ? 'animate-slide-out' : 'animate-slide-in'}`}>
                <div className="user-review-top">
                    <button className="back-button" onClick={handleClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                    <h2 className="review-title">"{targetNickname}"님의 거래 리뷰 내역</h2>
                </div>

                <div className="average-rating-box">
                    <div className="positive-negative-reviews">
                        <div className="review-category-card">
                            <p className="category-title positive">긍정적 리뷰 {stats.positiveReviews}개</p>
                            <p className="category-content">{isLoading ? '요약글을 생성 중입니다...' : positiveSummary}</p>
                        </div>
                        <div className="review-category-card">
                            <p className="category-title negative">부정적 리뷰 {stats.negativeReviews}개</p>
                            <p className="category-content">{isLoading ? '요약글을 생성 중입니다...' : negativeSummary}</p>
                        </div>
                    </div>
                    <p>"{targetNickname}"의 총 별점 평균과 총 리뷰 개수는</p>
                    <div className="big-stars">
                        {[1, 2, 3, 4, 5].map(starIndex => (
                            <span key={starIndex} className="big-star-wrapper">
                                <span className="big-star-background">★</span>
                                {stats.averageRating >= starIndex ? (
                                    <span className="big-star-foreground full">★</span>
                                ) : stats.averageRating >= starIndex - 0.5 ? (
                                    <span className="big-star-foreground half">★</span>
                                ) : null}
                            </span>
                        ))}
                    </div>
                    <div className="rating-summary">{stats.averageRating.toFixed(1)} / {stats.totalReviews}개</div>
                </div>

                <div className="review-filters-container">
                    <div className="review-filters">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="filter-icon">
                            <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" />
                        </svg>
                        <button className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => handleFilterClick('all')}>전체</button>
                        <button className={`filter-button ${activeFilter === 'positive' ? 'active' : ''}`} onClick={() => handleFilterClick('positive')}>긍정</button>
                        <button className={`filter-button ${activeFilter === 'negative' ? 'active' : ''}`} onClick={() => handleFilterClick('negative')}>부정</button>
                    </div>
                </div>

                <div className={`review-list ${filteredReviews.length === 0 ? 'empty-state' : ''}`}>
                    {filteredReviews.length > 0 ? (
                        filteredReviews.map(review => (
                            <div className="review-card" key={review.reviewId}>
                                <img src={review.img} alt={review.title} className="product-thumb" />
                                <div className="review-info">
                                    <h3 className="product-title">상품명은 추후 추가</h3>
                                    <p className="review-date">{new Date(review.createdAt).toLocaleDateString()}</p>
                                    <div className="review-stars">
                                        {[1,2,3,4,5].map(starIndex => (
                                            <span key={starIndex} className="star-wrapper">
                                                <span className="star-background">★</span>
                                                {review.rating >= starIndex ? (
                                                    <span className="star-foreground full">★</span>
                                                ) : review.rating >= starIndex - 0.5 ? (
                                                    <span className="star-foreground half">★</span>
                                                ) : null}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="review-options">
                                        {review.kind && <span className="review-badge kind-badge">친절해요</span>}
                                        {review.promise && <span className="review-badge promise-badge">약속을 잘 지켜요</span>}
                                        {review.satisfaction && <span className="review-badge satisfaction-badge">만족해요</span>}
                                        {!review.kind && <span className="review-badge unkind-badge">불친절해요</span>}
                                        {!review.promise && <span className="review-badge unpromised-badge">약속을 안 지켜요</span>}
                                        {!review.satisfaction && <span className="review-badge unsatisfaction-badge">불만족스러워요</span>}
                                    </div>
                                    <div className="comment-text-box">
                                        <p className="review-comment">{review.summary}</p>
                                    </div>
                                </div>
                                <button className="userreview-detail-link" onClick={() => handleReviewDetailOpen(review)}>리뷰 상세</button>
                            </div>
                        ))
                    ) : (
                        <p>작성된 리뷰가 없습니다.</p>
                    )}
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
