"use client";

import React, { useState } from 'react';
import './mypage.css';
import MyReviewList from '@/app/review/components/MyReviewList';
import UserReviewList from '@/app/review/components/UserReviewList';
import ProductCard from '@/components/common/ProductCard';
import TradingAreaManagement from '@/app/(user)/location-management/page';
import WishlistSidebar from "@/components/common/WishlistSidebar";
import { useSidebar } from "@/hooks/useSidebar";

// 📌 더미 데이터
const dummyPurchases = [
    { id: 1, productName: '아기 옷 세트', price: '15,000원', location: '양재동', timeAgo: '1주 전', imageUrl: 'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg', trade_status: 'ON_SALE', status: 'NEW', hasWrittenReview: false, showReviewButton: false },
    { id: 2, productName: '아기 옷 세트', price: '15,000원', location: '양재동', timeAgo: '1주 전', imageUrl: 'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg', trade_status: 'ON_SALE', status: 'NEW', hasWrittenReview: false, showReviewButton: false },
];

const dummySales = [
    { id: 1, productName: '유아 원목 블록 세트', price: '25,000원', location: '서초동', timeAgo: '2일 전', imageUrl: 'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg', trade_status: 'SOLD', status: 'USED', hasWrittenReview: true, showReviewButton: false },
    { id: 2, productName: '유아 원목 블록 세트', price: '25,000원', location: '서초동', timeAgo: '2일 전', imageUrl: 'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg', trade_status: 'SOLD', status: 'USED', hasWrittenReview: true, showReviewButton: false },
];

// 📌 프로필, 자녀, 거래 현황 카드 묶음 컴포넌트
const ProfileSection = ({ onUserReviewClick }) => (
    <div className="profile-section">
        <div className="profile-card">
            <h3 className="card-title">프로필 정보</h3>
            <div className="profile-content">
                <div className="profile-avatar"></div>
                <h2 className="profile-name">멋진맘</h2>
                <div className="rating">
                    <span className="stars">⭐⭐⭐⭐⭐</span>
                    <span className="rating-score">(4.8)</span>
                </div>
                <div className="location-info">
                    <span className="location-label">거래 지역:</span>
                    <div className="location-tags">
                        <span className="location-tag">서초동</span>
                        <span className="location-tag">양재동</span>
                        <span className="location-tag">반포동</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="right-cards">
            <div className="child-card">
                <h3 className="card-title">자녀 정보</h3>
                <div className="child-content">
                    <p className="no-child-info">등록된 자녀정보가<br />없습니다.</p>
                </div>
            </div>

            <div className="transaction-card">
                <h3 className="card-title">나의 거래 현황</h3>
                <div className="transaction-content">
                    <div className="transaction-item">
                        <span className="transaction-label">총 구매</span>
                        <span className="transaction-value">{dummyPurchases.length}</span>
                        <span className="transaction-unit">건</span>
                    </div>
                    <div className="transaction-item">
                        <span className="transaction-label">총 판매</span>
                        <span className="transaction-value">{dummySales.length}</span>
                        <span className="transaction-unit">건</span>
                    </div>
                    <div className="transaction-item">
                        <span className="transaction-label">작성 리뷰</span>
                        <span className="transaction-value" onClick={onUserReviewClick}
                              style={{ cursor: 'pointer' }}>3</span>
                        <span className="transaction-unit">개</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const MyPage = () => {
    const [activeTab, setActiveTab] = useState('');
    const [dashboardTab, setDashboardTab] = useState('purchase');
    const { open: openLocationSidebar, isOpen: isLocationSidebarOpen } = useSidebar('location-management');
    const { open: openWishlistSidebar, isOpen: isWishlistSidebarOpen } = useSidebar('wishlist');
    const [reviewOpen, setReviewOpen] = useState(false);
    const [userReviewOpen, setUserReviewOpen] = useState(false);

    const renderDashboard = () => (
        <>
            <ProfileSection onUserReviewClick={() => setUserReviewOpen(true)} />
            <div className="tab-section">
                <div className="tab-list">
                    <button
                        className={`tab-item ${dashboardTab === 'purchase' ? 'active' : ''}`}
                        onClick={() => setDashboardTab('purchase')}
                    >
                        구매 상품
                    </button>
                    <button
                        className={`tab-item ${dashboardTab === 'sale' ? 'active' : ''}`}
                        onClick={() => setDashboardTab('sale')}
                    >
                        판매 상품
                    </button>
                </div>
            </div>

            <div className="tab-content-area">
                {dashboardTab === 'purchase'
                    ? renderProductList(dummyPurchases)
                    : renderProductList(dummySales)}
            </div>
        </>
    );

    const renderProductList = (products) => (
        <>
            <div className="item-count">총 {products.length} 개</div>
            {products.length === 0 ? (
                <div className="empty-state"><p>등록된 상품이 없습니다.</p></div>
            ) : (
                <div className="products-grid">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} size="size1" />
                    ))}
                </div>
            )}
        </>
    );

    return (
        <div className="mypage-container">
            <div className="main-content">
                <div className="sidebar">
                    <div className="menu-group">
                        <h3 className="menu-title">내 정보</h3>
                        <div className="menu-items">
                            <button className={`menu-item ${activeTab === 'profile-edit' ? 'active' : ''}`} onClick={() => setActiveTab('profile-edit')}>프로필 수정</button>
                            <button className={`menu-item ${activeTab === 'password-change' ? 'active' : ''}`} onClick={() => setActiveTab('password-change')}>비밀번호 변경</button>
                            <button className={`menu-item ${isLocationSidebarOpen ? 'active' : ''}`} onClick={openLocationSidebar}>거래지역 관리</button>
                            <button className={`menu-item ${activeTab === 'child-management' ? 'active' : ''}`} onClick={() => setActiveTab('child-management')}>자녀 관리</button>
                            <button className={`menu-item ${activeTab === 'account-delete' ? 'active' : ''}`} onClick={() => setActiveTab('account-delete')}>탈퇴하기</button>
                        </div>
                    </div>
                    <div className="menu-divider"></div>
                    <div className="menu-group">
                        <h3 className="menu-title">거래 정보</h3>
                        <div className="menu-items">
                            <a href="#" className="menu-item">찜한 상품</a>
                            <a href="#" className="menu-item" onClick={(e) => { e.preventDefault(); setReviewOpen(true); }}>리뷰 관리</a>
                        </div>
                    </div>
                </div>

                <div className="content-area">
                    {activeTab === '' ? renderDashboard() : activeTab === 'review-management' ? <p>리뷰 관리 컴포넌트</p> : null}
                </div>
            </div>

            {/* 사이드바 */}
            <MyReviewList open={reviewOpen} onClose={() => setReviewOpen(false)} />
            <UserReviewList open={userReviewOpen} onClose={() => setUserReviewOpen(false)} />
            <TradingAreaManagement />
            <WishlistSidebar trigger={<span style={{ display: 'none' }}>숨김</span>} />
        </div>
    );
};

export default MyPage;
