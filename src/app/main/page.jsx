"use client";

import React, { useState } from "react";
import ProductCard from "../../components/common/ProductCard";
import Link from "next/link";
import "./Main.css";

export default function MainPage() {
  // 슬라이드 상태 관리 - 스르륵 슬라이드
  const [popularSlideIndex, setPopularSlideIndex] = useState(0);
  const [recommendedSlideIndex, setRecommendedSlideIndex] = useState(0);
  const [newSlideIndex, setNewSlideIndex] = useState(0);

  const itemsPerSlide = 6; // 한 번에 보여줄 아이템 수
  const cardWidth = 157; // 카드 너비
  const gap = 10; // 카드 간격
  const slideDistance = cardWidth + gap; // 슬라이드 거리

  // 슬라이드 함수들 - 스르륵 움직임
  const handleSlide = (direction, currentIndex, setIndex, totalItems) => {
    const maxIndex = Math.ceil(totalItems / itemsPerSlide) - 1;

    if (direction === "next") {
      setIndex(currentIndex < maxIndex ? currentIndex + 1 : 0);
    } else {
      setIndex(currentIndex > 0 ? currentIndex - 1 : maxIndex);
    }
  };

  const getVisibleItems = (items, slideIndex) => {
    const startIndex = slideIndex * itemsPerSlide;
    return items.slice(startIndex, startIndex + itemsPerSlide);
  };

  const hallOfFameUsers = [
    {
      id: 1,
      rank: 1,
      nickname: "rank111",
      profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWzYXkVFhflifovTly-AUwXvU5clKQDybxow&s",
      weeklyReviews: 11,
      averageRating: 4.8,
    },
    {
      id: 2,
      rank: 2,
      nickname: "rank222",
      profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWzYXkVFhflifovTly-AUwXvU5clKQDybxow&s",
      weeklyReviews: 222,
      averageRating: 4.8,
    },
    {
      id: 3,
      rank: 3,
      nickname: "rank333",
      profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWzYXkVFhflifovTly-AUwXvU5clKQDybxow&s",
      weeklyReviews: 5000,
      averageRating: 4.8,
    },
  ];

  const popularProducts = [
    {
      id: 1,
      productName: "상품명 가나다라마나나나 나나나나나나나나나나.....",
      price: "5,000원",
      location: "송림 1동",
      timeAgo: "9시간 전",
      imageUrl:
        "https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474",
      trade_status: "ON_SALE",
      status: "NEW",
      hasWrittenReview: false,
      showReviewButton: false,
    },
    {
      id: 2,
      productName: "상품명 ㅋㅋ",
      price: "5,000원",
      location: "송림 1동",
      timeAgo: "9시간 전",
      imageUrl:
        "https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474",
      trade_status: "ON_SALE",
      status: "NEW",
      hasWrittenReview: false,
      showReviewButton: false,
    },
    {
      id: 3,
      productName: "유아용 장난감 세트",
      price: "15,000원",
      location: "송림 2동",
      timeAgo: "1시간 전",
      imageUrl:
        "https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474",
      trade_status: "ON_SALE",
      status: "USED",
      hasWrittenReview: false,
      showReviewButton: false,
    },
    {
      id: 4,
      productName: "아기 옷 세트 (6개월)",
      price: "25,000원",
      location: "송림 3동",
      timeAgo: "3시간 전",
      imageUrl:
        "https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474",
      trade_status: "ON_SALE",
      status: "NEW",
      hasWrittenReview: false,
      showReviewButton: false,
    },
    {
      id: 5,
      productName: "유모차 (거의 새것)",
      price: "120,000원",
      location: "송림 4동",
      timeAgo: "5시간 전",
      imageUrl:
        "https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474",
      trade_status: "ON_SALE",
      status: "USED",
      hasWrittenReview: false,
      showReviewButton: false,
    },
    {
      id: 6,
      productName: "아기 침대 + 매트리스",
      price: "80,000원",
      location: "송림 5동",
      timeAgo: "7시간 전",
      imageUrl:
        "https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474",
      trade_status: "ON_SALE",
      status: "USED",
      hasWrittenReview: false,
      showReviewButton: false,
    },
    {
      id: 7,
      productName: "육아용품 종합세트",
      price: "35,000원",
      location: "송림 6동",
      timeAgo: "10시간 전",
      imageUrl:
        "https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474",
      trade_status: "ON_SALE",
      status: "NEW",
      hasWrittenReview: false,
      showReviewButton: false,
    },
    {
      id: 8,
      productName: "아기 카시트",
      price: "45,000원",
      location: "송림 7동",
      timeAgo: "12시간 전",
      imageUrl:
        "https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474",
      trade_status: "ON_SALE",
      status: "USED",
      hasWrittenReview: false,
      showReviewButton: false,
    },
    {
      id: 9,
      productName: "젖병 세트 (신품)",
      price: "18,000원",
      location: "송림 8동",
      timeAgo: "1일 전",
      imageUrl:
        "https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474",
      trade_status: "ON_SALE",
      status: "NEW",
      hasWrittenReview: false,
      showReviewButton: false,
    },
    {
      id: 10,
      productName: "아기 보행기",
      price: "30,000원",
      location: "송림 9동",
      timeAgo: "1일 전",
      imageUrl:
        "https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474",
      trade_status: "ON_SALE",
      status: "USED",
      hasWrittenReview: false,
      showReviewButton: false,
    },
    {
      id: 11,
      productName: "기저귀 가방",
      price: "22,000원",
      location: "송림 10동",
      timeAgo: "2일 전",
      imageUrl:
        "https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474",
      trade_status: "ON_SALE",
      status: "NEW",
      hasWrittenReview: false,
      showReviewButton: false,
    },
    {
      id: 12,
      productName: "아기 욕조",
      price: "12,000원",
      location: "송림 11동",
      timeAgo: "2일 전",
      imageUrl:
        "https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474",
      trade_status: "ON_SALE",
      status: "USED",
      hasWrittenReview: false,
      showReviewButton: false,
    },
    {
      id: 13,
      productName: "유아 책 세트 (20권)",
      price: "40,000원",
      location: "송림 12동",
      timeAgo: "3일 전",
      imageUrl:
        "https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474",
      trade_status: "ON_SALE",
      status: "USED",
      hasWrittenReview: false,
      showReviewButton: false,
    },
    {
      id: 14,
      productName: "아기 식탁의자",
      price: "55,000원",
      location: "송림 13동",
      timeAgo: "3일 전",
      imageUrl:
        "https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474",
      trade_status: "ON_SALE",
      status: "NEW",
      hasWrittenReview: false,
      showReviewButton: false,
    },
    {
      id: 15,
      productName: "분유 제조기",
      price: "35,000원",
      location: "송림 14동",
      timeAgo: "4일 전",
      imageUrl:
        "https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474",
      trade_status: "ON_SALE",
      status: "USED",
      hasWrittenReview: false,
      showReviewButton: false,
    },
    {
      id: 16,
      productName: "아기 체중계",
      price: "28,000원",
      location: "송림 15동",
      timeAgo: "4일 전",
      imageUrl:
        "https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474",
      trade_status: "ON_SALE",
      status: "NEW",
      hasWrittenReview: false,
      showReviewButton: false,
    },
    {
      id: 17,
      productName: "유아 미끄럼틀",
      price: "65,000원",
      location: "송림 16동",
      timeAgo: "5일 전",
      imageUrl:
        "https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474",
      trade_status: "ON_SALE",
      status: "USED",
      hasWrittenReview: false,
      showReviewButton: false,
    },
    {
      id: 18,
      productName: "아기 모니터",
      price: "42,000원",
      location: "송림 17동",
      timeAgo: "5일 전",
      imageUrl:
        "https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474",
      trade_status: "ON_SALE",
      status: "NEW",
      hasWrittenReview: false,
      showReviewButton: false,
    },
    {
      id: 19,
      productName: "유모차 레인커버",
      price: "8,000원",
      location: "송림 18동",
      timeAgo: "6일 전",
      imageUrl:
        "https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474",
      trade_status: "ON_SALE",
      status: "USED",
      hasWrittenReview: false,
      showReviewButton: false,
    },
    {
      id: 20,
      productName: "아기 온도계 세트",
      price: "15,000원",
      location: "송림 19동",
      timeAgo: "1주일 전",
      imageUrl:
        "https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474",
      trade_status: "ON_SALE",
      status: "NEW",
      hasWrittenReview: false,
      showReviewButton: false,
    },
  ];

  // 추천 상품 데이터 (20개)
  const recommendedProducts = [
    ...popularProducts.map((product) => ({
      ...product,
      id: product.id + 100,
      productName: product.productName + " (추천)",
    })),
  ];

  // 신규 상품 데이터 (20개)
  const newProducts = [
    ...popularProducts.map((product) => ({
      ...product,
      id: product.id + 200,
      productName: product.productName + " (신규)",
      timeAgo: "방금 전",
    })),
  ];

  return (
    <div className="main-container">
      {/* 명예의 전당 섹션 */}
      <section className="main-hall-of-fame-section">
        <h2 className="main-section-title">명예의 전당</h2>
        <div className="main-hall-of-fame-content">
          {hallOfFameUsers.map((user) => (
            <div key={user.id} className={`main-hall-of-fame-container rank-${user.rank}`}>
              <div className="main-hall-of-fame-card">
                <div className="main-user-profile">
                  <div className="main-profile-header">
                    <span className="main-rank-number">{user.rank}</span>
                  </div>
                  <div className="main-profile-content">
                    <div className="main-profile-info">
                      <div className="main-profile-image-container">
                        <img src={user.profileImage} alt={`${user.nickname} 프로필`} className="main-profile-image" />
                        <div className="main-medal-container">
                          <img
                            src={
                              user.rank === 1
                                ? "/images/main/icon-medal-gold.svg"
                                : user.rank === 2
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
                            <span className="main-stat-label">이번 주 리뷰: </span>
                            <span className="main-stat-value">{user.weeklyReviews}개</span>
                          </div>
                          <div className="main-stat-item">
                            <img src="/images/main/star.svg" alt="별점" className="main-stat-icon" />
                            <span className="main-stat-label">평균 별점: </span>
                            <span className="main-stat-value">{user.averageRating} 점</span>
                          </div>
                          <div className="main-rank-badge">
                            <span className="main-rank-text">#{user.rank}위</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="main-podium">
                <span className="main-podium-number">{user.rank}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 구분선 */}
      <div className="main-section-divider"></div>

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
