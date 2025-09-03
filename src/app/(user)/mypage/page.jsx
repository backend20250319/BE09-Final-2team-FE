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
import { useUser, useIsAuthenticated, useUserLoading, useCheckAuthStatus } from '@/store/userStore';
import { extractPhoneNumbers } from '@/app/(user)/components/phoneUtils';
import { useRouter } from 'next/navigation';
import { userAPI } from '@/lib/api';
import {
    useProfileInfo,
    useChildrenList,
    useTradingSummary,
    useGetMypageDashboard,
    usePurchasedProducts,
    useGetPurchasedProducts,
    useSoldProducts,
    useGetSoldProducts,
    useMyPageLoading,
} from "@/store/mypageStore";

const MyPage = () => {
    const router = useRouter();
    const user = useUser();
    const isAuthenticated = useIsAuthenticated();
    const loading = useUserLoading();
    const checkAuthStatus = useCheckAuthStatus();

    // myPageStore의 훅 사용
    const profileInfo = useProfileInfo();
    const childrenList = useChildrenList();
    const tradingSummary = useTradingSummary();
    const getMypageDashboard = useGetMypageDashboard();
    const purchasedProducts = usePurchasedProducts();
    const getPurchasedProducts = useGetPurchasedProducts();
    const soldProducts = useSoldProducts();
    const getSoldProducts = useGetSoldProducts();
    const myPageLoading = useMyPageLoading();

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

    // 인증, 대시보드 데이터, 탭별 데이터를 모두 여기서 한 번에 관리
    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            try {
                // 1. 초기 인증 상태 확인
                if (!isAuthenticated || !user?.id) {
                    const authResult = await checkAuthStatus();
                    if (!mounted) return;

                    if (!authResult) {
                        console.log('인증 실패 - 로그인 페이지로 이동');
                        router.replace('/login');
                        return; // 인증 실패 시 함수 종료
                    }
                }

                // 2. 대시보드 기본 정보 로드 (user.id가 있을 때만)
                if (mounted && user?.id) {
                    await getMypageDashboard(user.id);
                }

                // 3. 탭별 데이터 로드
                if (dashboardTab === "purchase" && purchasedProducts.length === 0) {
                    console.log('구매 상품 데이터 로딩');
                    await getPurchasedProducts();
                } else if (dashboardTab === "sale" && soldProducts.length === 0) {
                    console.log('판매 상품 데이터 로딩');
                    await getSoldProducts();
                }

            } catch (error) {
                console.error('데이터 로딩 중 오류:', error);
                if (mounted) {
                    router.replace('/login');
                }
            }
        };

        loadData();

        return () => {
            mounted = false;
        };
    }, [
        isAuthenticated, user, checkAuthStatus, getMypageDashboard, router,
        dashboardTab, purchasedProducts.length, soldProducts.length, getPurchasedProducts, getSoldProducts
    ]);

    // 로딩 중이면 로딩 화면 표시
    if (loading || !user) {
        return (
            <div className="mypage-container">
                <div className="loading-container">
                    <div>로딩 중...</div>
                </div>
            </div>
        );
    }

    const renderProfileSection = () => (
        <div className="profile-section">
            <div className="profile-card">
                <h3 className="card-title">프로필 정보</h3>
                <div className="profile-content">
                    <div className="profile-avatar"></div>
                    <h2 className="profile-name">{profileInfo?.nickname || '사용자'}</h2>
                    <div className="rating">
              <span className="stars">
                  ⭐⭐⭐⭐⭐
                  {/* 평점 데이터가 있다면 동적으로 표시 */}
                  {/*{'⭐'.repeat(Math.round(profileInfo?.rating || 0))}*/}
              </span>
                        <span className="rating-score">
                  (4.8)
                  {/*<span className="rating-score">({profileInfo?.rating?.toFixed(1) || '0.0'})</span>*/}
              </span>
                    </div>
                    <div className="location-info">
                        <span className="location-label">거래 지역:</span>
                        <div className="location-tags">
                            {profileInfo?.tradeLocations && profileInfo.tradeLocations.length > 0 ? (
                                profileInfo.tradeLocations.map((location, index) => (
                                    <span key={`location-${index}`} className="location-tag">
                                    {location}
                                </span>
                                ))
                            ) : (
                                <span className="location-tag">지역 없음</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="right-cards">
                <div className="child-card">
                    <h3 className="card-title">자녀 정보</h3>
                    <div className="child-content">
                        {childrenList.length === 0 ? (
                            <p className="no-child-info">
                                등록된 자녀정보가
                                <br />
                                없습니다.
                            </p>
                        ) : (
                            <div className="children-display">
                                {childrenList.map((child, index) => (
                                    <div key={`child-${child.id || index}`} className="child-info-card">
                                        <div className="child-header">
                                            <span className="child-emoji">👶</span>
                                            <span className="child-nickname">{child.nickname}</span>
                                        </div>
                                        <div className="child-birth-date">
                                            {new Date(child.birthDate).getFullYear()}년{' '}
                                            {new Date(child.birthDate).getMonth() + 1}월{' '}
                                            {new Date(child.birthDate).getDate()}일
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
                            <span className="transaction-value">{tradingSummary?.purchaseCount || 0}</span>
                            <span className="transaction-unit">건</span>
                        </div>
                        <div className="transaction-item">
                            <span className="transaction-label">총 판매</span>
                            <span className="transaction-value">{tradingSummary?.saleCount || 0}</span>
                            <span className="transaction-unit">건</span>
                        </div>
                        <div className="transaction-item">
                            <span className="transaction-label">작성 리뷰</span>
                            <span className="transaction-value">{tradingSummary?.reviewCount || 0}</span>
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
                        <div className="item-count">총 {purchasedProducts.length || 0} 개</div>
                        {myPageLoading.purchases ? (
                            <div className="loading-state">
                                <p>구매 상품을 불러오는 중...</p>
                            </div>
                        ) : purchasedProducts?.length === 0 ? (
                            <div className="empty-state">
                                <p>등록된 구매 상품이 없습니다.</p>
                            </div>
                        ) : (
                            <div className="products-grid">
                                {purchasedProducts?.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={{
                                            ...product,
                                            name: product.name,
                                        }}
                                        size="size1"
                                        showReviewButton={true}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className="item-count">총 {soldProducts?.length || 0} 개</div>
                        {myPageLoading.sales ? (
                            <div className="loading-state">
                                <p>판매 상품을 불러오는 중...</p>
                            </div>
                        ) : soldProducts?.length === 0 ? (
                            <div className="empty-state">
                                <p>등록된 판매 상품이 없습니다.</p>
                            </div>
                        ) : (
                            <div className="products-grid">
                                {soldProducts?.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={{
                                            ...product,
                                            name: product.name
                                        }}
                                        size="size1"
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );

    // 프로필 수정
    const handleProfileUpdate = async (updatedData) => {
        try {
            const changes = {};

            // 닉네임 변경 여부 확인
            if (updatedData.nickname !== (profileInfo?.nickname || '')) {
                changes.nickname = updatedData.nickname;
            }

            // 이메일 변경 여부 확인
            if (updatedData.email !== (profileInfo?.email || '')) {
                changes.email = updatedData.email;
            }

            // 전화번호 변경 여부 확인 및 하이픈 제거
            const cleanedPhoneNumber = extractPhoneNumbers(updatedData.phone);
            if (cleanedPhoneNumber !== (profileInfo?.phoneNumber || '')) {
                changes.phoneNumber = cleanedPhoneNumber;
            }

            // 변경된 사항이 없으면 API 호출하지 않고 종료
            if (Object.keys(changes).length === 0) {
                console.log('변경된 사항이 없어 프로필 업데이트를 건너뜁니다.');
                return { success: true };
            }

            console.log('최종 전송 데이터:', changes);

            // 백엔드 API 호출 - 변경된 데이터만 전송
            const response = await userAPI.updateProfile(changes);

            console.log('프로필 수정 성공:', response.data);

            // 성공하면 대시보드 새로고침
            if (user?.id) {
                await getMypageDashboard(user.id);
            }

            return { success: true };
        } catch (error) {
            console.error('프로필 수정 실패:', error);
            throw error;
        }
    };

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
            <ProfileEdit  currentUserInfo={profileInfo} onProfileUpdate={handleProfileUpdate}/>
            <PasswordChange />
            <MyReviewList open={reviewOpen} onClose={() => setReviewOpen(false)}  />
            <UserReviewList open={userReviewOpen} onClose={() => setUserReviewOpen(false)} />
            <TradingAreaManagement />
            <ChildManagement />
            <WishlistSidebar trigger={<span style={{ display: "none" }}>숨김</span>} />
            <WithdrawlSidebar />
        </div>
    );
};

export default MyPage;