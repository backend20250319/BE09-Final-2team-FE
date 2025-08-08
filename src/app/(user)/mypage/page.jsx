"use client"; // 이 컴포넌트가 클라이언트 컴포넌트임을 명시합니다.

import React, { useState } from 'react';
import './mypage.css'; // mypage.css 파일을 임포트합니다.

const MyPage = () => {
    const [activeTab, setActiveTab] = useState('purchase');

    return (
        <div className="mypage-container">
            <div className="main-content">
                {/* Left Sidebar */}
                <div className="sidebar">
                    <div className="menu-group">
                        <h3 className="menu-title">내 정보</h3>
                        <div className="menu-items">
                            <a href="#" className="menu-item">프로필 수정</a>
                            <a href="#" className="menu-item">비밀번호 변경</a>
                            <a href="#" className="menu-item">거래지역 관리</a>
                            <a href="#" className="menu-item">자녀 관리</a>
                            <a href="#" className="menu-item">탈퇴하기</a>
                        </div>
                    </div>

                    <div className="menu-divider"></div>

                    <div className="menu-group">
                        <h3 className="menu-title">거래 정보</h3>
                        <div className="menu-items">
                            <a href="#" className="menu-item">찜한 상품</a>
                            <a href="#" className="menu-item">리뷰 관리</a>
                        </div>
                    </div>
                </div>

                {/* Right Content Area */}
                <div className="content-area">
                    {/* Profile Cards Section - 상단에 위치 */}
                    <div className="profile-section">
                        {/* Left: Profile Info Card */}
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

                        {/* Right: Child & Transaction Cards */}
                        <div className="right-cards">
                            {/* Child Info Card */}
                            <div className="child-card">
                                <h3 className="card-title">자녀 정보</h3>
                                <div className="child-content">
                                    <p className="no-child-info">등록된 자녀정보가<br />없습니다.</p>
                                </div>
                            </div>

                            {/* Transaction Status Card */}
                            <div className="transaction-card">
                                <h3 className="card-title">나의 거래 현황</h3>
                                <div className="transaction-content">
                                    <div className="transaction-item">
                                        <span className="transaction-label">총 구매</span>
                                        <span className="transaction-value">0</span>
                                        <span className="transaction-unit">건</span>
                                    </div>
                                    <div className="transaction-item">
                                        <span className="transaction-label">총 판매</span>
                                        <span className="transaction-value">0</span>
                                        <span className="transaction-unit">건</span>
                                    </div>
                                    <div className="transaction-item">
                                        <span className="transaction-label">작성 리뷰</span>
                                        <span className="transaction-value">0</span>
                                        <span className="transaction-unit">개</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab Navigation - 프로필 카드 섹션 하단에 위치 */}
                    <div className="tab-section">
                        <div className="tab-list">
                            <button
                                className={`tab-item ${activeTab === 'purchase' ? 'active' : ''}`}
                                onClick={() => setActiveTab('purchase')}
                            >
                                구매 상품
                            </button>
                            <button
                                className={`tab-item ${activeTab === 'sale' ? 'active' : ''}`}
                                onClick={() => setActiveTab('sale')}
                            >
                                판매 상품
                            </button>
                        </div>
                    </div>
                    <div className="item-count">총 0 개</div> {/* 탭 리스트 아래에 위치 */}

                    {/* Empty State */}
                    <div className="empty-state">
                        <p>등록된 상품이 없습니다.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPage;