'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '../../../components/common/ProductCard';
import './search.css';

export default function Page() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAgeGroups, setSelectedAgeGroups] = useState(['0~6개월']);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [selectedOptions, setSelectedOptions] = useState(['판매완료 상품 제외', '새상품', '중고']);
    const [sortBy, setSortBy] = useState('추천순');
    const [isFromCategory, setIsFromCategory] = useState(true);

    // 카테고리 관련 상태
    const [categoryPath, setCategoryPath] = useState(['전체']);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isCategoryExpanded, setIsCategoryExpanded] = useState(false);

    // 카테고리 ID로 경로 찾기
    const findCategoryPath = (categoryId) => {
        const searchInTree = (tree, path = []) => {
            for (const category of tree) {
                const currentPath = [...path, category.name];
                if (category.id.toString() === categoryId) {
                    return currentPath;
                }
                if (category.children) {
                    const found = searchInTree(category.children, currentPath);
                    if (found) return found;
                }
            }
            return null;
        };
        return searchInTree(babyCategoryTree);
    };

    // URL 파라미터 확인
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        const keyword = urlParams.get('keyword');

        if (category) {
            // 카테고리로 들어온 경우: /search?category=3
            setIsFromCategory(true);
            setSelectedCategory(category);

            // 카테고리 ID로 경로 설정
            const categoryPath = findCategoryPath(category);
            if (categoryPath) {
                setCategoryPath(['전체', ...categoryPath]);
                setSelectedCategory(categoryPath[categoryPath.length - 1]);
                setSearchQuery(categoryPath[categoryPath.length - 1]);
            }
        }

        if (keyword) {
            // 검색어로 들어온 경우: /search?keyword=유모차
            setIsFromCategory(false);
            setSearchQuery(decodeURIComponent(keyword));
        }
    }, []);

    // 카테고리 확장/축소 토글 함수
    const toggleCategoryExpansion = () => {
        setIsCategoryExpanded((prev) => !prev);
    };

    // 카테고리 데이터 (트리 구조)
    const babyCategoryTree = [
        {
            id: 1,
            name: '출산/육아용품',
            parentId: null,
            children: [
                {
                    id: 101,
                    name: '모유수유용품',
                    parentId: 1,
                    children: [
                        { id: 1011, name: '유축기', parentId: 101, children: [] },
                        {
                            id: 1012,
                            name: '수유패드',
                            parentId: 101,
                            children: [
                                {
                                    id: 1013,
                                    name: '수유쿠션',
                                    parentId: 1012,
                                    children: [
                                        { id: 1014, name: '모유 저장팩/병', parentId: 1013, children: [] },
                                        { id: 1015, name: '젖병 세척용품', parentId: 1013, children: [] },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                { id: 102, name: '분유수유용품', parentId: 1, children: [] },
                { id: 103, name: '튼살크림/스킨케어', parentId: 1, children: [] },
                { id: 104, name: '임부복/수유복/언더웨어', parentId: 1, children: [] },
                { id: 105, name: '물티슈/기저귀', parentId: 1, children: [] },
                { id: 106, name: '분유/이유식', parentId: 1, children: [] },
                { id: 107, name: '아기띠/기저귀가방', parentId: 1, children: [] },
                { id: 108, name: '신생아/영유아의류', parentId: 1, children: [] },
                { id: 109, name: '유아로션/목욕용품', parentId: 1, children: [] },
                { id: 110, name: '유아건강/위생용품', parentId: 1, children: [] },
                { id: 111, name: '유모차/웨건', parentId: 1, children: [] },
            ],
        },
        {
            id: 2,
            name: '유아동의류',
            parentId: null,
            children: [
                { id: 201, name: '유아용의류', parentId: 2, children: [] },
                { id: 202, name: '아동용의류', parentId: 2, children: [] },
                { id: 203, name: '내의/잠옷/속옷', parentId: 2, children: [] },
                { id: 204, name: '패딩/자켓', parentId: 2, children: [] },
                { id: 205, name: '한복/소품', parentId: 2, children: [] },
            ],
        },
        {
            id: 3,
            name: '유아동잡화',
            parentId: null,
            children: [
                { id: 301, name: '구두/운동화/샌들/부츠', parentId: 3, children: [] },
                { id: 302, name: '장화/우비/우산', parentId: 3, children: [] },
                { id: 303, name: '모자/장갑', parentId: 3, children: [] },
                { id: 304, name: '책가방/여행가방', parentId: 3, children: [] },
            ],
        },
        {
            id: 4,
            name: '유아동교구/완구',
            parentId: null,
            children: [
                { id: 401, name: '신생아완구', parentId: 4, children: [] },
                { id: 402, name: '원목교구', parentId: 4, children: [] },
                { id: 403, name: '음악놀이/자석교구', parentId: 4, children: [] },
                { id: 404, name: '전동차/핫휠', parentId: 4, children: [] },
                { id: 405, name: '로봇', parentId: 4, children: [] },
                { id: 406, name: '인형/디즈니의상', parentId: 4, children: [] },
                { id: 407, name: '블록/레고', parentId: 4, children: [] },
                { id: 408, name: '대형 완구용품', parentId: 4, children: [] },
            ],
        },
        {
            id: 5,
            name: '유아동안전/실내용품',
            parentId: null,
            children: [{ id: 501, name: '카시트', parentId: 5, children: [] }],
        },
        {
            id: 6,
            name: '유아동가구',
            parentId: null,
            children: [{ id: 601, name: '침대/매트리스', parentId: 6, children: [] }],
        },
        {
            id: 7,
            name: '기타 유아동용품',
            parentId: null,
            children: [],
        },
    ];

    // 현재 표시할 카테고리 찾기
    const getCurrentCategory = () => {
        if (categoryPath.length === 1) return null; // 메인 카테고리 뷰

        // 동적으로 경로를 따라가면서 현재 카테고리 찾기
        let currentCategory = babyCategoryTree.find((cat) => cat.name === categoryPath[1]);

        for (let i = 2; i < categoryPath.length; i++) {
            if (currentCategory?.children) {
                currentCategory = currentCategory.children.find((cat) => cat.name === categoryPath[i]);
            } else {
                return null;
            }
        }

        return currentCategory;
    };

    // 카테고리 클릭 핸들러
    const handleCategoryClick = (categoryName) => {
        let clickedCategory;

        if (categoryPath.length === 1) {
            // 메인 카테고리에서 첫 번째 클릭
            clickedCategory = babyCategoryTree.find((cat) => cat.name === categoryName);
        } else {
            // 하위 카테고리에서 클릭
            const currentCategory = getCurrentCategory();
            clickedCategory = currentCategory?.children?.find((cat) => cat.name === categoryName);
        }

        const newPath = categoryPath.slice(1).concat(categoryName);
        setCategoryPath(['전체', ...newPath]);
        // 선택된 카테고리를 경로의 마지막 카테고리로 설정
        setSelectedCategory(categoryName);

        // URL 업데이트 - 현재 검색어 유지하면서 카테고리 추가
        if (clickedCategory) {
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('category', clickedCategory.id.toString());
            const newUrl = `/product/search?${urlParams.toString()}`;
            window.history.pushState({}, '', newUrl);
        }
    };

    // 브레드크럼 클릭 핸들러
    const handleBreadcrumbClick = (index) => {
        if (index === 0) {
            // "전체" 클릭 시 메인으로 돌아가기
            setCategoryPath(['전체']);
            setSelectedCategory(null);
            // URL에서 카테고리 파라미터 제거
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.delete('category');
            const newUrl = `/product/search?${urlParams.toString()}`;
            window.history.pushState({}, '', newUrl);
        } else {
            // 해당 인덱스까지만 경로 유지
            const newPath = categoryPath.slice(0, index + 1);
            setCategoryPath(newPath);
            // 선택된 카테고리를 경로의 마지막 카테고리로 설정
            setSelectedCategory(newPath[newPath.length - 1]);

            // URL 업데이트 - 해당 경로의 카테고리 ID 찾기
            const targetCategoryName = newPath[newPath.length - 1];
            let targetCategory = null;

            if (newPath.length === 2) {
                // 메인 카테고리
                targetCategory = babyCategoryTree.find((cat) => cat.name === targetCategoryName);
            } else {
                // 하위 카테고리 - 경로를 따라가면서 찾기
                let currentCategory = babyCategoryTree.find((cat) => cat.name === newPath[1]);

                for (let i = 2; i < newPath.length - 1; i++) {
                    if (currentCategory?.children) {
                        currentCategory = currentCategory.children.find((cat) => cat.name === newPath[i]);
                    }
                }

                if (currentCategory?.children) {
                    targetCategory = currentCategory.children.find((cat) => cat.name === targetCategoryName);
                }
            }

            if (targetCategory) {
                const urlParams = new URLSearchParams(window.location.search);
                urlParams.set('category', targetCategory.id.toString());
                const newUrl = `/product/search?${urlParams.toString()}`;
                window.history.pushState({}, '', newUrl);
            }
        }
    };

    // 샘플 상품 데이터
    const products = Array.from({ length: 12 }, (_, index) => ({
        id: index + 1,
        productName: '상품명 ㅋㅋ',
        price: '5,000원',
        location: '송림 1동',
        timeAgo: '9시간 전',
        imageUrl:
            'https://img2.joongna.com/media/original/2025/08/02/1754123031593IIO_ka4X1.jpg?impolicy=resizeWatermark3&ftext=%EA%B0%80%EA%B2%8C180474',
        trade_status: 'ON_SALE',
        status: 'NEW',
        hasWrittenReview: false,
        showReviewButton: false,
    }));

    const toggleAgeGroup = (age) => {
        setSelectedAgeGroups((prev) => (prev.includes(age) ? prev.filter((a) => a !== age) : [...prev, age]));
    };

    const toggleOption = (option) => {
        setSelectedOptions((prev) => {
            let newOptions;

            if (option === '판매완료 상품 제외') {
                // 판매완료 상품 제외는 독립적으로 토글
                newOptions = prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option];
            } else {
                // 새상품, 중고는 서로 연관됨
                if (prev.includes(option)) {
                    // 선택된 옵션을 해제
                    newOptions = prev.filter((o) => o !== option);
                } else {
                    // 선택되지 않은 옵션을 추가
                    newOptions = [...prev, option];
                }

                // 새상품과 중고가 둘 다 해제되면 둘 다 다시 체크
                if (!newOptions.includes('새상품') && !newOptions.includes('중고')) {
                    newOptions = [...newOptions, '새상품', '중고'];
                }
            }

            return newOptions;
        });
    };

    return (
        <div className='search-product-search-page'>
            {/* 검색&필터 섹션 */}
            <section className='search-search-filter-section'>
                {/* 검색 결과 헤더 */}
                <div className='search-search-result-header'>
                    {isFromCategory ? (
                        // 카테고리로 들어온 경우
                        <>
                            <span className='search-search-result-text'>검색 결과</span>
                        </>
                    ) : (
                        // 검색어로 들어온 경우
                        <>
                            <h1 className='search-search-query'>{searchQuery}</h1>
                            <span className='search-search-result-text'>검색 결과</span>
                            <span className='search-total-count'>총 4,036개</span>
                        </>
                    )}
                </div>

                <div className='search-divider-line'></div>

                {/* 카테고리 필터 */}
                <div className='search-filter-section'>
                    <div
                        className='search-filter-header'
                        onClick={toggleCategoryExpansion}
                        style={{ cursor: 'pointer' }}
                    >
                        <h3>카테고리</h3>
                        <img
                            src={isCategoryExpanded ? '/images/product/minus.svg' : '/images/product/plus.svg'}
                            alt={isCategoryExpanded ? '축소' : '확장'}
                            className='search-expand-icon'
                        />
                    </div>
                    <div className='search-filter-content'>
                        <div className='search-breadcrumb'>
                            {categoryPath.map((item, index) => (
                                <React.Fragment key={index}>
                                    <span
                                        onClick={() => {
                                            handleBreadcrumbClick(index);
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {item}
                                    </span>
                                    {index < categoryPath.length - 1 && <span className='search-separator'>&gt;</span>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 세부 카테고리 */}
                {isCategoryExpanded && (
                    <div className='search-filter-section expanded'>
                        <div className='search-filter-header'>
                            <div className='search-filter-placeholder'></div>
                        </div>
                        <div className='search-filter-content'>
                            <div className='search-category-grid'>
                                {categoryPath.length === 1 ? (
                                    // 메인 카테고리 뷰
                                    babyCategoryTree.map((category) => (
                                        <div key={category.id} className='search-category-item'>
                                            <span
                                                className={selectedCategory === category.name ? 'selected' : ''}
                                                onClick={() => handleCategoryClick(category.name)}
                                            >
                                                {category.name}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    // 서브 카테고리 뷰
                                    <div className='search-sub-categories-container'>
                                        {getCurrentCategory()?.children?.map((subCategory) => (
                                            <div key={subCategory.id} className='search-category-item'>
                                                <span
                                                    className={`search-sub-category-item ${
                                                        selectedCategory === subCategory.name ? 'selected' : ''
                                                    }`}
                                                    onClick={() => handleCategoryClick(subCategory.name)}
                                                >
                                                    {subCategory.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* 연령대 필터 */}
                <div className='search-filter-section'>
                    <div className='search-filter-header'>
                        <h3>연령대</h3>
                    </div>
                    <div className='search-filter-content'>
                        <div className='search-checkbox-group'>
                            {['0~6개월', '6~12개월', '1~2세', '2~4세', '4~6세', '6~8세', '8세 이상'].map((age) => (
                                <label key={age} className='search-checkbox-item' onClick={() => toggleAgeGroup(age)}>
                                    <img
                                        src={
                                            selectedAgeGroups.includes(age)
                                                ? '/images/product/checkbox-marked.svg'
                                                : '/images/product/checkbox-blank.svg'
                                        }
                                        alt='checkbox'
                                        className='search-checkbox-icon'
                                    />
                                    <span className='search-checkbox-text'>{age}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 가격 필터 */}
                <div className='search-filter-section'>
                    <div className='search-filter-header'>
                        <h3>가격</h3>
                    </div>
                    <div className='search-filter-content'>
                        <div className='search-price-range'>
                            <input
                                type='text'
                                placeholder='최소가격'
                                value={priceRange.min}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                    setPriceRange((prev) => ({ ...prev, min: value }));
                                }}
                                className='search-price-input'
                            />
                            <span className='search-price-separator'>~</span>
                            <input
                                type='text'
                                placeholder='최대가격'
                                value={priceRange.max}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                    setPriceRange((prev) => ({ ...prev, max: value }));
                                }}
                                className='search-price-input'
                            />
                            <button className='search-apply-button'>적용</button>
                        </div>
                    </div>
                </div>

                {/* 지역 필터 */}
                <div className='search-filter-section expanded'>
                    <div className='search-filter-header'>
                        <h3>지역</h3>
                    </div>
                    <div className='search-filter-content'></div>
                </div>

                {/* 옵션 필터 */}
                <div className='search-filter-section'>
                    <div className='search-filter-header'>
                        <h3>옵션</h3>
                    </div>
                    <div className='search-filter-content'>
                        <div className='search-checkbox-group'>
                            {['판매완료 상품 제외', '새상품', '중고'].map((option) => (
                                <label
                                    key={option}
                                    className='search-checkbox-item'
                                    onClick={() => toggleOption(option)}
                                >
                                    <img
                                        src={
                                            selectedOptions.includes(option)
                                                ? '/images/product/checkbox-marked.svg'
                                                : '/images/product/checkbox-blank.svg'
                                        }
                                        alt='checkbox'
                                        className='search-checkbox-icon'
                                    />
                                    <span className='search-checkbox-text'>{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 정렬 섹션 */}
            <section className='search-sort-section'>
                <div className='search-sort-options'>
                    {['추천순', '최신순', '낮은가격순', '높은가격순'].map((option, index) => (
                        <React.Fragment key={option}>
                            <button
                                className={`search-sort-option ${sortBy === option ? 'active' : ''}`}
                                onClick={() => setSortBy(option)}
                            >
                                {option}
                            </button>
                            {index < 3 && <span className='search-sort-separator'>|</span>}
                        </React.Fragment>
                    ))}
                </div>
            </section>

            {/* 상품 섹션 */}
            <section className='search-products-section'>
                <div className='search-products-grid'>
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} size='size3' />
                    ))}
                </div>
            </section>
        </div>
    );
}
