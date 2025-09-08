"use client";

import { productAPI, reviewAPI } from "@/lib/api"; // reviewAPI 추가
import React, { useState, useEffect } from "react";
import ProductCard from "../../components/common/ProductCard";
import "./Main.css";

export default function MainPage() {
  // 슬라이드 상태 관리
  const [popularSlideIndex, setPopularSlideIndex] = useState(0);
  const [recommendedSlideIndex, setRecommendedSlideIndex] = useState(0);
  const [newSlideIndex, setNewSlideIndex] = useState(0);

  // 상품 리스트
  const [popularProducts, setPopularProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);

  // 명예의 전당 유저 리스트
  const [hallOfFameUsers, setHallOfFameUsers] = useState([]);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const { data } = await productAPI.getHomeSections();
        if (data.success) {
          setPopularProducts(data.data.popular);
          setRecommendedProducts(data.data.recommended);
          setNewProducts(data.data.latest);
        }
      } catch (err) {
        console.error("홈 섹션 조회 실패:", err);
      }
    };

    const fetchHallOfFame = async () => {
      try {
        const { data } = await reviewAPI.getReviewRanking();
        if (data.success) {
          const rankingUsers = data.data;

          // 각 유저 리뷰 개수 추가 조회
          const usersWithCounts = await Promise.all(
            rankingUsers.map(async (user) => {
              try {
                const res = await reviewAPI.getUserReviewCount(user.userId);
                const reviewCount = res.data?.count ?? 0; // ✅ count 로 접근
                return { ...user, totalReviews: reviewCount };
              } catch (err) {
                console.error(`리뷰 개수 조회 실패 (userId=${user.userId})`, err);
                return { ...user, totalReviews: 0 };
              }
            })
          );

          setHallOfFameUsers(usersWithCounts);
        }
      } catch (err) {
        console.error("명예의 전당 조회 실패:", err);
      }
    };

    fetchSections();
    fetchHallOfFame();
  }, []);

  // 슬라이드 관련
  const itemsPerSlide = 6;
  const cardWidth = 157;
  const gap = 10;
  const slideDistance = cardWidth + gap;

  const handleSlide = (direction, currentIndex, setIndex, totalItems) => {
    const maxIndex = Math.ceil(totalItems / itemsPerSlide) - 1;
    if (direction === "next") {
      setIndex(currentIndex < maxIndex ? currentIndex + 1 : 0);
    } else {
      setIndex(currentIndex > 0 ? currentIndex - 1 : maxIndex);
    }
  };

  return (
    <div className="main-container">
      {/* 명예의 전당 섹션 */}
      <section className="main-hall-of-fame-section">
        <h2 className="main-section-title">명예의 전당</h2>
        <div className="main-hall-of-fame-content">
          {hallOfFameUsers.map((user, index) => (
            <div key={user.userId} className={`main-hall-of-fame-container rank-${index + 1}`}>
              <div className="main-hall-of-fame-card">
                <div className="main-user-profile">
                  <div className="main-profile-header">
                    <span className="main-rank-number">{index + 1}</span>
                  </div>
                  <div className="main-profile-content">
                    <div className="main-profile-info">
                      <div className="main-profile-image-container">
                        <img
                          src={user.profileImage || "/images/main/default-profile.png"}
                          alt={`${user.nickname} 프로필`}
                          className="main-profile-image"
                        />
                        <div className="main-medal-container">
                          <img
                            src={
                              index + 1 === 1
                                ? "/images/main/icon-medal-gold.svg"
                                : index + 1 === 2
                                ? "/images/main/icon-medal-silver.svg"
                                : "/images/main/icon-medal-bronze.svg"
                            }
                            alt="메달"
                            className="main-medal-image"
                          />
                        </div>
                      </div>
                      <div className="main-user-details">
                        <h3 className="main-user-nickname">{user.nickname}</h3>
                        <div className="main-user-stats">
                          <div className="main-stat-item">
                            <img src="/images/main/uil-calender.svg" alt="캘린더" className="main-stat-icon" />
                            <span className="main-stat-label">총 리뷰: </span>
                            <span className="main-stat-value">{user.totalReviews}개</span>
                          </div>
                          <div className="main-stat-item">
                            <img src="/images/main/star.svg" alt="별점" className="main-stat-icon" />
                            <span className="main-stat-label">평균 별점: </span>
                            <span className="main-stat-value">{user.averageRating} 점</span>
                          </div>
                          <div className="main-rank-badge">
                            <span className="main-rank-text">#{index + 1}위</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="main-podium">
                <span className="main-podium-number">{index + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 인기 상품 섹션 */}
      <section className="main-products-section">
        <h2 className="main-section-title">인기 상품</h2>
        <div className="main-products-content">
          <div className="main-products-grid">
            <div
              className="main-products-slider"
              style={{
                transform: `translateX(-${popularSlideIndex * slideDistance * itemsPerSlide}px)`,
              }}
            >
              {popularProducts.map((product) => (
                <ProductCard key={product.id} product={product} size="size1" />
              ))}
            </div>
          </div>
          <div className="main-navigation-arrows">
            <button
              className="main-nav-arrow left"
              disabled={popularSlideIndex === 0}
              onClick={() => handleSlide("prev", popularSlideIndex, setPopularSlideIndex, popularProducts.length)}
            >
              <img src="/images/main/arrow-left.svg" alt="이전" />
            </button>
            <button
              className="main-nav-arrow right"
              disabled={popularSlideIndex >= Math.ceil(popularProducts.length / itemsPerSlide) - 1}
              onClick={() => handleSlide("next", popularSlideIndex, setPopularSlideIndex, popularProducts.length)}
            >
              <img src="/images/main/arrow-right.svg" alt="다음" />
            </button>
          </div>
        </div>
      </section>

      {/* 구분선 */}
      <div className="main-section-divider"></div>

      {/* 추천 상품 섹션 */}
      <section className="main-products-section">
        <h2 className="main-section-title">추천 상품</h2>
        <div className="main-products-content">
          <div className="main-products-grid">
            <div
              className="main-products-slider"
              style={{
                transform: `translateX(-${recommendedSlideIndex * slideDistance * itemsPerSlide}px)`,
              }}
            >
              {recommendedProducts.map((product) => (
                <ProductCard key={product.id} product={product} size="size1" />
              ))}
            </div>
          </div>
          <div className="main-navigation-arrows">
            <button
              className="main-nav-arrow left"
              disabled={recommendedSlideIndex === 0}
              onClick={() =>
                handleSlide("prev", recommendedSlideIndex, setRecommendedSlideIndex, recommendedProducts.length)
              }
            >
              <img src="/images/main/arrow-left.svg" alt="이전" />
            </button>
            <button
              className="main-nav-arrow right"
              disabled={recommendedSlideIndex >= Math.ceil(recommendedProducts.length / itemsPerSlide) - 1}
              onClick={() =>
                handleSlide("next", recommendedSlideIndex, setRecommendedSlideIndex, recommendedProducts.length)
              }
            >
              <img src="/images/main/arrow-right.svg" alt="다음" />
            </button>
          </div>
        </div>
      </section>

      {/* 구분선 */}
      <div className="main-section-divider"></div>

      {/* 신규 상품 섹션 */}
      <section className="main-products-section">
        <h2 className="main-section-title">신규 상품</h2>
        <div className="main-products-content">
          <div className="main-products-grid">
            <div
              className="main-products-slider"
              style={{
                transform: `translateX(-${newSlideIndex * slideDistance * itemsPerSlide}px)`,
              }}
            >
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} size="size1" />
              ))}
            </div>
          </div>
          <div className="main-navigation-arrows">
            <button
              className="main-nav-arrow left"
              disabled={newSlideIndex === 0}
              onClick={() => handleSlide("prev", newSlideIndex, setNewSlideIndex, newProducts.length)}
            >
              <img src="/images/main/arrow-left.svg" alt="이전" />
            </button>
            <button
              className="main-nav-arrow right"
              disabled={newSlideIndex >= Math.ceil(newProducts.length / itemsPerSlide) - 1}
              onClick={() => handleSlide("next", newSlideIndex, setNewSlideIndex, newProducts.length)}
            >
              <img src="/images/main/arrow-right.svg" alt="다음" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
