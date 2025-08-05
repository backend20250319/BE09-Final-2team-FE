// MyReviewPage.jsx
'use client';
import React, { useState, useEffect } from 'react';
import './Myreviewpage.css';

// SVG 아이콘들을 별도의 컴포넌트로 분리하여 재사용성을 높였습니다.
const SearchIcon = () => (
    <svg className="search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 3L21 21" stroke="#999999" strokeWidth="1.4"/>
        <path d="M16.7 16.7L21 21" stroke="#999999" strokeWidth="1.4"/>
    </svg>
);

const CategoryIcon = () => (
    <svg className="category-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 4H17V6H3V4Z" stroke="white" strokeWidth="1"/>
    </svg>
);

const HeartIcon = () => (
    <svg className="category-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 5L12 14L21 5" stroke="white" strokeWidth="1"/>
    </svg>
);

const StarIcon = ({ fill = 'white' }) => (
    <svg className="category-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" stroke={fill} strokeWidth="1.5"/>
    </svg>
);

const ChatIcon = () => (
    <svg className="menu-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 12H16M8 8H16M8 16H12" stroke="black" strokeWidth="1.5"/>
    </svg>
);

const MyReviewPage = () => {
    // 기존 JS 파일의 데이터 역할을 대신하는 목업(Mock) 데이터
    const mockReviewData = {
        productTitle: '고래 장난감 판매합니다',
        reviewDate: '2000년 00월 00일',
        rating: 5,
        reviewDetails: [
            '상대가 친절 했어요.',
            '상대가 약속을 잘 지켰어요.',
            '상품 상태가 좋아요.'
        ],
        reviewText: '상품이 좋아요',
        imageSrc: 'product-image-whale.jpg'
    };

    // 상태 관리
    const [reviewData, setReviewData] = useState(mockReviewData);
    const [activeCategory, setActiveCategory] = useState('카테고리');
    const [searchTerm, setSearchTerm] = useState('');

    // 컴포넌트가 마운트될 때 실행될 로직
    // 기존 JS의 document.addEventListener('DOMContentLoaded', ...) 역할을 대신합니다.
    useEffect(() => {
        console.log('Review Detail Page initialized');
        // 실제 애플리케이션에서는 여기서 API 호출 로직이 들어갑니다.
        // 예를 들어: fetchReviewData().then(data => setReviewData(data));
    }, []);

    // 이벤트 핸들러 함수들
    const handleCategoryClick = (categoryName) => {
        setActiveCategory(categoryName);
        console.log('Category selected:', categoryName);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            console.log('Search submitted:', searchTerm);
        }
    };

    const handleBackButtonClick = () => {
        console.log('Back button clicked');
        alert('이전 페이지로 돌아갑니다.');
    };

    const handleEditButtonClick = () => {
        console.log('Edit button clicked');
        alert('리뷰 수정 페이지로 이동합니다.');
    };

    // CSS 파일에서 사용된 클래스명은 그대로 className 속성으로 사용합니다.
    return (
        <div className="page-container">
            {/* Header */}
            <header className="main-header">
                <div className="header-content">
                    {/* Logo */}
                    <div className="logo">
                        <img src="logo-placeholder.png" alt="로고" className="logo-image" />
                    </div>

                    {/* Search Bar */}
                    <div className="search-container">
                        <form className="search-bar" onSubmit={handleSearchSubmit}>
                            <input
                                type="text"
                                placeholder="어떤 육아 용품을 찾고 계신가요?"
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <SearchIcon />
                        </form>
                    </div>

                    {/* Category Navigation */}
                    <nav className="category-nav">
                        {['카테고리', '찜한상품', '육아꿀팁', '공동구매', '이벤트'].map((category, index) => (
                            <div
                                key={index}
                                className={`category-item ${activeCategory === category ? 'active' : ''}`}
                                onClick={() => handleCategoryClick(category)}
                            >
                                {category === '카테고리' && <CategoryIcon />}
                                {category === '찜한상품' && <HeartIcon />}
                                {['육아꿀팁', '공동구매', '이벤트'].includes(category) && <StarIcon fill="white" />}
                                <span>{category}</span>
                            </div>
                        ))}
                    </nav>

                    {/* Right Menu */}
                    <div className="right-menu">
                        <div className="menu-item" onClick={() => console.log('채팅하기 클릭')}>
                            <ChatIcon />
                            <span>채팅하기</span>
                        </div>
                        <div className="divider"></div>
                        <div className="menu-item" onClick={() => console.log('판매하기 클릭')}>
                            <StarIcon fill="black" />
                            <span>판매하기</span>
                        </div>
                        <div className="divider"></div>
                        <div className="menu-item" onClick={() => console.log('마이 클릭')}>
                            <StarIcon fill="black" />
                            <span>마이</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Overlay Background */}
            <div className="overlay-background" onClick={() => alert('사이드바를 닫습니다.')}></div>

            {/* Review Detail Sidebar */}
            <aside className="review-detail-sidebar">
                <div className="sidebar-header">
                    <button className="back-button" onClick={handleBackButtonClick}>
                        <svg width="21" height="30" viewBox="0 0 21 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.91 7.44L8.64 12.71L13.91 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <h1 className="sidebar-title">나의 리뷰 내역</h1>
                </div>

                {/* Review Detail Content */}
                <div className="review-detail-content">
                    {/* Product Image */}
                    <div className="product-image-container">
                        <img src={reviewData.imageSrc} alt={reviewData.productTitle} className="product-image" />
                    </div>

                    {/* Product Information */}
                    <div className="product-info">
                        <h2 className="product-title">{reviewData.productTitle}</h2>
                        <p className="review-date">{reviewData.reviewDate}</p>

                        {/* Star Rating */}
                        <div className="star-rating">
                            {[...Array(5)].map((_, index) => (
                                <span key={index} className={`star ${index < reviewData.rating ? 'active' : ''}`}>★</span>
                            ))}
                        </div>
                    </div>

                    {/* Review Details */}
                    <div className="review-details">
                        {reviewData.reviewDetails.map((detail, index) => (
                            <div key={index} className="review-detail-item">
                                <span className="detail-text">{detail}</span>
                            </div>
                        ))}
                    </div>

                    {/* Review Text */}
                    <div className="review-text-container">
                        <div className="review-text-area">
                            <p className="review-text">{reviewData.reviewText}</p>
                            <div className="character-count">{reviewData.reviewText.length}/1000</div>
                        </div>
                    </div>

                    {/* Edit Button */}
                    <div className="edit-button-container">
                        <button className="edit-button" onClick={handleEditButtonClick}>수정 하기</button>
                    </div>
                </div>
            </aside>
        </div>
    );
};
export default MyReviewPage;/* MyReviewAdd.css */

