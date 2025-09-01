"use client";

import React, { useState, useEffect } from 'react';
import './other-user-profile.css';
import ProductCard from '@/components/common/ProductCard';
import UserReviewList from '@/app/review/components/UserReviewList';
import { userAPI } from '@/lib/api';
import { getProfileImageUrl } from '@/utils/profileImageUtils';

export default function UserProfilePage({ params }) {
    // Next.js 15+ 방식: React.use()로 params 언래핑
    const resolvedParams = React.use(params);
    const actualUserId = resolvedParams.userId;

    console.log("페이지 params:", { params, resolvedParams, actualUserId });

    const [dashboardTab, setDashboardTab] = useState('sale');
    const [userReviewOpen, setUserReviewOpen] = useState(false);

    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                console.log("=== 타 사용자 프로필 조회 시작 ===");
                console.log("actualUserId:", actualUserId);

                setIsLoading(true);
                setError(null);

                const response = await userAPI.getOtherUserProfile(actualUserId);

                // 1. 응답 전체 구조 로깅
                console.log("전체 응답:", response);
                console.log("응답 상태:", response.status);
                console.log("응답 데이터:", response.data);

                // 2. API 응답 구조 검증
                if (!response.data) {
                    throw new Error("응답 데이터가 없습니다");
                }

                // 3. success 필드 확인
                if (!response.data.success) {
                    throw new Error(response.data.message || "API 호출이 실패했습니다");
                }

                const data = response.data.data;
                console.log("추출된 데이터:", data);

                // 4. 필수 데이터 구조 검증
                if (!data) {
                    throw new Error("데이터가 비어있습니다");
                }

                if (!data.profileInfo) {
                    console.warn("프로필 정보가 없습니다:", data);
                }

                if (!data.transactionSummary) {
                    console.warn("거래 요약 정보가 없습니다:", data);
                }

                if (!data.soldProducts) {
                    console.warn("판매 상품 정보가 없습니다, 빈 배열로 설정");
                    data.soldProducts = [];
                }

                console.log("최종 설정할 데이터:", data);
                setProfileData(data);

            } catch (err) {
                console.error("타 사용자 프로필 조회 실패:", err);
                console.error("에러 세부사항:", {
                    message: err.message,
                    response: err.response?.data,
                    status: err.response?.status
                });
                setError(`사용자 정보를 불러오는 데 실패했습니다: ${err.message}`);
            } finally {
                // 성공하든 실패하든 로딩 상태는 false로 설정
                setIsLoading(false);
                console.log("로딩 상태를 false로 설정");
            }
        };

        if (actualUserId) {
            console.log("actualUserId가 존재하므로 프로필 조회 시작:", actualUserId);
            fetchUserProfile();
        } else {
            console.warn("actualUserId가 없습니다:", { params, resolvedParams, actualUserId });
            setError("사용자 ID가 필요합니다");
            setIsLoading(false);
        }

    }, [actualUserId]); // actualUserId를 의존성으로 변경

    const renderProfileSection = () => {
        // 안전한 데이터 접근
        const profileInfo = profileData?.profileInfo;
        const transactionSummary = profileData?.transactionSummary;

        console.log("프로필 섹션 렌더링:");
        console.log("- profileInfo:", profileInfo);
        console.log("- transactionSummary:", transactionSummary);

        if (!profileInfo) {
            console.log("프로필 정보가 없어서 빈 화면 표시");
            return <div>프로필 정보를 불러올 수 없습니다</div>;
        }

        return (
            <div className="profile-section">
                <div className="profile-card">
                    <h3 className="card-title">프로필 정보</h3>
                    <div className="profile-content">
                        <div className="profile-avatar" style={{
                            backgroundImage: `url(${getProfileImageUrl(profileInfo?.profileImageUrl, profileInfo?.id)})`}}
                        />
                        <h2 className="profile-name">{profileInfo?.nickname || '알 수 없는 사용자'}</h2>
                        <div className="rating">
                            <span className="stars">
                                {'⭐'.repeat(Math.round(profileInfo?.reviewScore || 0))}
                            </span>
                            <span className="rating-score">({profileInfo?.reviewScore || 0})</span>
                        </div>
                        <div className="location-info">
                            <span className="location-label">거래 지역:</span>
                            <div className="location-tags">
                                {profileInfo?.tradeLocations && profileInfo.tradeLocations.length > 0 ? (
                                    profileInfo.tradeLocations.map((location, index) => (
                                        <span key={index} className="location-tag">{location}</span>
                                    ))
                                ) : (
                                    <span className="location-tag">지역 없음</span>
                                )}
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
                                <span className="transaction-value">{transactionSummary?.totalSalesCount || 0}</span>
                                <span className="transaction-unit">건</span>
                                <span className="transaction-arrow-space"></span>
                            </div>
                        </div>
                        <div className="transaction-item">
                            <span className="transaction-label">상품 개수</span>
                            <div className="transaction-right">
                                <span className="transaction-value">{transactionSummary?.salesCount || 0}</span>
                                <span className="transaction-unit">건</span>
                                <span className="transaction-arrow-space"></span>
                            </div>
                        </div>
                        <div className="transaction-item clickable" onClick={() => setUserReviewOpen(true)}>
                            <span className="transaction-label">받은 리뷰</span>
                            <div className="transaction-right">
                                <span className="transaction-value">{transactionSummary?.reviewCount || 0}</span>
                                <span className="transaction-unit">개</span>
                                <span className="transaction-arrow">{'>'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderProducts = () => {
        const soldProducts = profileData?.soldProducts || [];

        console.log("상품 목록 렌더링:");
        console.log("- soldProducts 개수:", soldProducts.length);
        console.log("- 첫 번째 상품:", soldProducts[0]);

        return (
            <>
                <div className="item-count">총 {soldProducts.length} 개</div>
                {soldProducts.length === 0 ? (
                    <div className="empty-state">
                        <p>등록된 판매 상품이 없습니다.</p>
                    </div>
                ) : (
                    <div className="products-grid">
                        {soldProducts.map((product, index) => {
                            console.log(`상품 ${index}:`, product);
                            return (
                                <ProductCard
                                    key={product.id || index}
                                    product={product}
                                    size="size1"
                                />
                            );
                        })}
                    </div>
                )}
            </>
        );
    };

    // 로딩 중일 때
    if (isLoading) {
        console.log("로딩 중 화면 표시");
        return (
            <div className="loading-container" style={{ padding: '50px', textAlign: 'center' }}>
                사용자 정보를 불러오는 중입니다...
            </div>
        );
    }

    // 에러가 있을 때
    if (error) {
        console.log("에러 화면 표시:", error);
        return (
            <div className="error-container" style={{ padding: '50px', textAlign: 'center', color: 'red' }}>
                {error}
                <br />
                <button onClick={() => window.location.reload()} style={{ marginTop: '20px' }}>
                    새로고침
                </button>
            </div>
        );
    }

    // 데이터가 없을 때
    if (!profileData) {
        console.log("프로필 데이터 없음");
        return (
            <div className="no-data-container" style={{ padding: '50px', textAlign: 'center' }}>
                프로필 데이터를 찾을 수 없습니다
            </div>
        );
    }

    console.log("정상 렌더링 시작");
    // 데이터가 성공적으로 로드된 후 렌더링
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
                        {renderProducts()}
                    </div>
                </div>
            </div>
            <UserReviewList
                open={userReviewOpen}
                onClose={() => setUserReviewOpen(false)}
                userId={actualUserId}
            />
        </div>
    );
}