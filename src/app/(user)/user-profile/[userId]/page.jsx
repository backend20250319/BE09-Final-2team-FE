"use client";

import React, { useState } from 'react';
import './other-user-profile.css';
import ProductCard from '@/components/common/ProductCard';
import UserReviewList from '@/app/review/components/UserReviewList'; // 리뷰 컴포넌트 임포트

const OtherUserProfile = ({ userId }) => {
    const [dashboardTab, setDashboardTab] = useState('sale');
    const [userReviewOpen, setUserReviewOpen] = useState(false); // 리뷰 사이드바 상태

    // 더미 데이터 (실제로는 userId로 서버에서 가져올 데이터)
    // TODO: API 연결 시 userId 사용하여 사용자별 데이터 fetch
    const userData = {
        name: '멋진맘',
        rating: 4.8,
        reviewCount: 3,
        locations: ['서초동', '양재동', '반포동'],
        totalPurchases: 1,
        totalSales: 3
    };

    const dummySales = [
        { id: 1, productName: '유아 원목 블록 세트', price: '25,000원', location: '서초동', timeAgo: '2일 전', imageUrl: 'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg', trade_status: 'ON_SALE', status: 'USED' },
        { id: 2, productName: '아기 옷 세트', price: '15,000원', location: '양재동', timeAgo: '1주 전', imageUrl: 'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg', trade_status: 'SOLD', status: 'NEW' },
        { id: 3, productName: '유아용 장난감', price: '30,000원', location: '반포동', timeAgo: '3일 전', imageUrl: 'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg', trade_status: 'ON_SALE', status: 'USED' },
    ];

    const renderProfileSection = () => (
        <div className="profile-section">
            <div className="profile-card">
                <h3 className="card-title">프로필 정보</h3>
                <div className="profile-content">
                    <div className="profile-avatar"></div>
                    <h2 className="profile-name">{userData.name}</h2>
                    <div className="rating">
                        <span className="stars">⭐⭐⭐⭐⭐</span>
                        <span className="rating-score">({userData.rating})</span>
                    </div>
                    <div className="location-info">
                        <span className="location-label">거래 지역:</span>
                        <div className="location-tags">
                            {userData.locations.map((location, index) => (
                                <span key={index} className="location-tag">{location}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="transaction-summary-card">
                <h3 className="card-title">거래 현황</h3>
                <div className="transaction-summary-content">
                    <div className="transaction-item">
                        <span className="transaction-label">상품판매 개수</span>
                        <div className="transaction-right">
                            <span className="transaction-value">{userData.totalPurchases}</span>
                            <span className="transaction-unit">건</span>
                            <span className="transaction-arrow-space"></span>
                        </div>
                    </div>
                    <div className="transaction-item">
                        <span className="transaction-label">상품 개수</span>
                        <div className="transaction-right">
                            <span className="transaction-value">{userData.totalSales}</span>
                            <span className="transaction-unit">건</span>
                            <span className="transaction-arrow-space"></span>
                        </div>
                    </div>
                    <div className="transaction-item clickable" onClick={() => setUserReviewOpen(true)}>
                        <span className="transaction-label">받은 리뷰</span>
                        <div className="transaction-right">
                            <span className="transaction-value">{userData.reviewCount}</span>
                            <span className="transaction-unit">개</span>
                            <span className="transaction-arrow">{'>'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="other-user-profile-container">
            <div className="main-content">
                <div className="content-area">
                    {renderProfileSection()}

                    <div className="tab-section">
                        <div className="tab-list">
                            <button
                                className={`tab-item ${dashboardTab === 'sale' ? 'active' : ''}`}
                                onClick={() => setDashboardTab('sale')}
                            >
                                판매 상품
                            </button>
                        </div>
                    </div>

                    <div className="tab-content-area">
                        <>
                            <div className="item-count">총 {dummySales.length} 개</div>
                            {dummySales.length === 0 ? (
                                <div className="empty-state">
                                    <p>등록된 판매 상품이 없습니다.</p>
                                </div>
                            ) : (
                                <div className="products-grid">
                                    {dummySales.map((product) => (
                                        <ProductCard key={product.id} product={product} size="size1" />
                                    ))}
                                </div>
                            )}
                        </>
                    </div>
                </div>
            </div>

            {/* 리뷰 사이드바 */}
            <UserReviewList
                open={userReviewOpen}
                onClose={() => setUserReviewOpen(false)}
                user={userId}
            />
        </div>
    );
};

export default OtherUserProfile;