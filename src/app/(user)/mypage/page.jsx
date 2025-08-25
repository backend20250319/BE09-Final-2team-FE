"use client";

import React, { useState, useEffect } from "react";
import "./mypage.css";
import { useSidebar } from "@/hooks/useSidebar";
import ProfileEdit from "@/app/(user)/profile-edit/page";
import PasswordChange from "@/app/(user)/password-change/page";
import ProductCard from "@/components/common/ProductCard";
import TradingAreaManagement from "@/app/(user)/location-management/page";
import ChildManagement from "@/app/(user)/child-management/page";
import WishlistSidebar from "@/components/common/WishlistSidebar";
import WithdrawlSidebar from "../withdrawal/components/withdrawlSidebar";
import MyReviewList from "@/app/review/components/MyReviewList";
import UserReviewList from "@/app/review/components/UserReviewList";
import { useUser, useIsAuthenticated, useUserLoading, useCheckAuthStatus } from '@/store/userStore'; // 개별 훅 사용
import { useRouter } from 'next/navigation';
import {useProfileInfo, useFetchProfileInfo} from "@/store/mypageStore";

const MyPage = () => {
  const router = useRouter();
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const loading = useUserLoading();
  const checkAuthStatus = useCheckAuthStatus();

  // myPageStore의 훅 사용
    const profileInfo = useProfileInfo();
    const fetchProfileInfo = useFetchProfileInfo();

  const [activeTab, setActiveTab] = useState("");
  const [dashboardTab, setDashboardTab] = useState("purchase");
  const { open: openProfileEditSidebar } = useSidebar("profile-edit");
  const { open: openPasswordChangeSidebar } = useSidebar("password-change");
  const { open: openLocationSidebar } = useSidebar("location-management");
  const { open: openChildManagementSidebar } = useSidebar("child-management");
  const { open: openWishlistSidebar } = useSidebar("wishlist");
  const { open: openWidthdrawalSidebar } = useSidebar("withdrawal");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [userReviewOpen, setUserReviewOpen] = useState(false);

    useEffect(() => {
        const initAuth = async () => {
            try {
                if (loading) return;

                if (isAuthenticated && user) {
                    // 인증된 상태일 때 프로필 정보 가져오기
                    fetchProfileInfo();
                    return;
                }

                const isAuth = await checkAuthStatus();
                console.log('🔍 인증 상태 체크 결과:', isAuth);

                if (isAuth) {
                    // 인증 성공 시 프로필 정보 가져오기
                    fetchProfileInfo();
                } else {
                    console.log('❌ 인증 실패 - 로그인 페이지로 이동');
                    router.replace('/login');
                }
            } catch (error) {
                console.error('인증 체크 에러:', error);
                router.replace('/login');
            }
        };

        void initAuth();
    }, [isAuthenticated, loading]);


  // 더미 데이터들 그대로 유지
  const dummyChildren = [
    { id: 1, nickname: '첫째', birthDate: '2023-06-30', age: 2 },
    { id: 2, nickname: '둘째', birthDate: '2025-03-19', age: 0 }
  ];

  const dummyPurchases = [
    {
      id: 1,
      productName: "아기 옷 세트",
      price: "15,000원",
      location: "양재동",
      timeAgo: "1주 전",
      imageUrl: "https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg",
      trade_status: "ON_SALE",
      status: "NEW",
      showReviewButton: true,
    },
    {
      id: 2,
      productName: "아기 옷 세트",
      price: "15,000원",
      location: "양재동",
      timeAgo: "1주 전",
      imageUrl: "https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg",
      trade_status: "ON_SALE",
      status: "NEW",
      showReviewButton: true,
    },
  ];

  const dummySales = [
    {
      id: 1,
      productName: "유아 원목 블록 세트",
      price: "25,000원",
      location: "서초동",
      timeAgo: "2일 전",
      imageUrl: "https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg",
      trade_status: "SOLD",
      status: "USED",
    },
    {
      id: 2,
      productName: "유아 원목 블록 세트",
      price: "25,000원",
      location: "서초동",
      timeAgo: "2일 전",
      imageUrl: "https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg",
      trade_status: "SOLD",
      status: "USED",
    },
  ];
  const dummyReviews = [
    { id: 1, content: "좋은 거래였습니다" },
    { id: 2, content: "상품 상태 좋아요" },
    { id: 3, content: "친절하게 거래해주셨어요" },
  ];

  const renderProfileSection = () => (
      <div className="profile-section">
        <div className="profile-card">
          <h3 className="card-title">프로필 정보</h3>
          <div className="profile-content">
            <div className="profile-avatar"></div>
            <h2 className="profile-name">{profileInfo?.nickname || '사용자'}</h2>
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
              {dummyChildren.length === 0 ? (
                  <p className="no-child-info">
                    등록된 자녀정보가
                    <br />
                    없습니다.
                  </p>
              ) : (
                  <div className="children-display">
                    {dummyChildren.map(child => (
                        <div key={child.id} className="child-info-card">
                          <div className="child-header">
                            <span className="child-emoji">👶</span>
                            <span className="child-nickname">{child.nickname}</span>
                          </div>
                          <div className="child-birth-date">
                            {new Date(child.birthDate).getFullYear()}년 {new Date(child.birthDate).getMonth() + 1}월 {new Date(child.birthDate).getDate()}일
                          </div>
                          <div className="child-current-age">{child.age}세</div>
                        </div>
                    ))}
                  </div>
              )}
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
                <span className="transaction-value">{dummyReviews.length}</span>
                <span className="transaction-unit">개</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  );

  const renderDashboard = () => (
      <>
        {renderProfileSection()}
        <div className="tab-section">
          <div className="tab-list">
            <button
                className={`tab-item ${dashboardTab === "purchase" ? "active" : ""}`}
                onClick={() => setDashboardTab("purchase")}
            >
              구매 상품
            </button>
            <button
                className={`tab-item ${dashboardTab === "sale" ? "active" : ""}`}
                onClick={() => setDashboardTab("sale")}
            >
              판매 상품
            </button>
          </div>
        </div>

        <div className="tab-content-area">
          {dashboardTab === "purchase" ? (
              <>
                <div className="item-count">총 {dummyPurchases.length} 개</div>
                {dummyPurchases.length === 0 ? (
                    <div className="empty-state">
                      <p>등록된 구매 상품이 없습니다.</p>
                    </div>
                ) : (
                    <div className="products-grid">
                      {dummyPurchases.map((product) => (
                          <ProductCard key={product.id} product={product} size="size1" />
                      ))}
                    </div>
                )}
              </>
          ) : (
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
          )}
        </div>
      </>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "":
        return renderDashboard();
      case "profile-edit":
        return (
            <div className="tab-content">
              <h2>프로필 수정</h2>
            </div>
        );
      case "password-change":
        return (
            <div className="tab-content">
              <h2>비밀번호 변경</h2>
            </div>
        );
      case "review-management":
        return (
            <div className="tab-content">
              <h2>리뷰 관리</h2>
            </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
      <div className="mypage-container">
        <div className="main-content">
          {/* 왼쪽 메뉴 */}
          <div className="sidebar">
            <div className="menu-group">
              <h3 className="menu-title">내 정보</h3>
              <div className="menu-items">
                <button onClick={openProfileEditSidebar}>프로필 수정</button>
                <button onClick={openPasswordChangeSidebar}>비밀번호 변경</button>
                <button onClick={openLocationSidebar}>거래지역 관리</button>
                <button onClick={openChildManagementSidebar}>자녀 관리</button>
                <button
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      openWidthdrawalSidebar();
                    }}
                >
                  탈퇴하기
                </button>
              </div>
            </div>

            <div className="menu-divider"></div>

            <div className="menu-group">
              <h3 className="menu-title">거래 정보</h3>
              <div className="menu-items">
                <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      openWishlistSidebar();
                    }}
                >
                  찜한 상품
                </a>
                <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setReviewOpen(true);
                    }}
                >
                  리뷰 관리
                </a>
              </div>
            </div>
          </div>

          {/* 오른쪽 컨텐츠 */}
          <div className="content-area">{renderDashboard()}</div>
        </div>

        {/* 사이드바들 */}
        <ProfileEdit />
        <PasswordChange />
        <MyReviewList open={reviewOpen} onClose={() => setReviewOpen(false)} />
        <UserReviewList open={userReviewOpen} onClose={() => setUserReviewOpen(false)} />
        <TradingAreaManagement />
        <ChildManagement />
        <WishlistSidebar trigger={<span style={{ display: "none" }}>숨김</span>} />
        <WithdrawlSidebar />
      </div>
  );
};

export default MyPage;