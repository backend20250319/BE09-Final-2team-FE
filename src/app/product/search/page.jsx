'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

import { productAPI } from '@/lib/api';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCategoryStore } from '@/store/categoryStore';
import { AgeGroup, AgeGroupText } from '@/enums/ageGroup';
import { SortOption, SortOptionText } from '@/enums/sortOption';
import { ProductStatus, ProductStatusText } from '@/enums/productStatus';
import ProductCard from '../../../components/common/ProductCard';
import AddressSearch from '../components/AddressSearch';
import './search.css';

// TODO: 무한스크롤 구현/ api 응답 page객체 활용
export default function Page() {
    const [totalCount, setTotalCount] = useState(0);

    const [loading, setLoading] = useState(false);

    const [searchQuery, setSearchQuery] = useState(''); // 검색
    const [selectedAgeGroups, setSelectedAgeGroups] = useState(Object.values(AgeGroup)); // 연령대

    // 가격
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    // 실제 검색에 반영될 값
    const [appliedPriceRange, setAppliedPriceRange] = useState({ min: '', max: '' });

    // 지역 선택 값 상태
    const [selectedAddresses, setSelectedAddresses] = useState([]);

    // ⚡ 옵션을 enum/boolean 기반으로 분리
    const [excludeSoldOut, setExcludeSoldOut] = useState(true);
    const [selectedStatuses, setSelectedStatuses] = useState([ProductStatus.NEW, ProductStatus.USED]);

    // 정렬
    const [sortBy, setSortBy] = useState(SortOption.RECOMMENDED);

    // 상품 리스트
    const [products, setProducts] = useState([]);

    // 무한스크롤 (페이징)
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const observerRef = useRef(null);

    const [isFromCategory, setIsFromCategory] = useState(true);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const categories = useCategoryStore((s) => s.categories);

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
                if (category.children?.length > 0) {
                    const found = searchInTree(category.children, currentPath);
                    if (found) return found;
                }
            }
            return null;
        };
        return searchInTree(categories);
    };

    // URL 파라미터 확인
    useEffect(() => {
        const categoryId = searchParams.get('category');
        const keyword = searchParams.get('keyword');

        if (categoryId) {
            setIsFromCategory(true);

            // ✅ 카테고리 객체 찾기
            const findCategoryById = (tree, id) => {
                for (const category of tree) {
                    if (category.id.toString() === id) return category;
                    if (category.children?.length > 0) {
                        const found = findCategoryById(category.children, id);
                        if (found) return found;
                    }
                }
                return null;
            };

            const categoryObj = findCategoryById(categories, categoryId);

            if (categoryObj) {
                setSelectedCategory(categoryObj); // ✅ 객체 저장
                setCategoryPath(['전체', ...findCategoryPath(categoryId)]); // breadcrumb 세팅
                setSearchQuery(categoryObj.name);
            } else {
                setCategoryPath(['전체']);
                setSelectedCategory(null);
            }
        }

        if (keyword) {
            setIsFromCategory(false);
            setSearchQuery(decodeURIComponent(keyword));
        } else {
            setSearchQuery('');
        }
    }, [searchParams, categories]);

    // 카테고리 확장/축소 토글
    const toggleCategoryExpansion = () => {
        setIsCategoryExpanded((prev) => !prev);
    };

    // 현재 표시할 카테고리
    const getCurrentCategory = () => {
        if (categoryPath.length === 1) return null;

        let currentCategory = categories.find((cat) => cat.name === categoryPath[1]);
        for (let i = 2; i < categoryPath.length; i++) {
            if (currentCategory?.children) {
                currentCategory = currentCategory.children.find((cat) => cat.name === categoryPath[i]);
            } else {
                return null;
            }
        }
        return currentCategory;
    };

    // 카테고리 클릭
    const handleCategoryClick = (category) => {
        setSelectedCategory(category); // ✅ 객체 통째로 저장
        const newPath = categoryPath.slice(1).concat(category.name);
        setCategoryPath(['전체', ...newPath]);

        const params = new URLSearchParams(searchParams);
        params.set('category', category.id.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    // 브레드크럼 클릭
    const handleBreadcrumbClick = (index) => {
        if (index === 0) {
            setCategoryPath(['전체']);
            setSelectedCategory(null);
            const params = new URLSearchParams(searchParams);
            params.delete('category');
            router.push(`${pathname}?${params.toString()}`);
        } else {
            const newPath = categoryPath.slice(0, index + 1);
            setCategoryPath(newPath);
            setSelectedCategory(newPath[newPath.length - 1]);

            const targetCategoryName = newPath[newPath.length - 1];
            let targetCategory = null;

            if (newPath.length === 2) {
                targetCategory = categories.find((cat) => cat.name === targetCategoryName);
            } else {
                let currentCategory = categories.find((cat) => cat.name === newPath[1]);
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
                setSelectedCategory(targetCategory); // ✅ 객체 저장
                const params = new URLSearchParams(searchParams);
                params.set('category', targetCategory.id.toString());
                router.push(`${pathname}?${params.toString()}`);
            }
        }
    };

    // ageGroup 필터 토글
    const toggleAgeGroup = (ageEnum) => {
        setSelectedAgeGroups((prev) =>
            prev.includes(ageEnum) ? prev.filter((a) => a !== ageEnum) : [...prev, ageEnum]
        );
    };

    // status 필터 토글
    const toggleStatus = (status) => {
        setSelectedStatuses((prev) => {
            let newStatuses;
            if (prev.includes(status)) {
                newStatuses = prev.filter((s) => s !== status);
            } else {
                newStatuses = [...prev, status];
            }
            if (!newStatuses.includes(ProductStatus.NEW) && !newStatuses.includes(ProductStatus.USED)) {
                newStatuses = [ProductStatus.NEW, ProductStatus.USED];
            }
            return newStatuses;
        });
    };

    // 판매완료 제외 토글
    const toggleExcludeSoldOut = () => setExcludeSoldOut((prev) => !prev);

    // ✅ 검색 API 호출 함수
    const fetchProducts = async (pageNumber = 0, append = false) => {
        setLoading(true);

        console.log('selectedCategory', selectedCategory);

        try {
            const searchRequest = {
                query: searchQuery || null,
                categoryId: selectedCategory?.id || null,
                ageGroups: selectedAgeGroups,
                priceMin: appliedPriceRange.min ? Number(appliedPriceRange.min) : null,
                priceMax: appliedPriceRange.max ? Number(appliedPriceRange.max) : null,
                areaIds: selectedAddresses.map((a) => a.id),
                excludeSoldOut,
                statuses: selectedStatuses,
                sort: sortBy,
                page: pageNumber,
                size: 20,
            };

            console.log('searchRequest: ', searchRequest);

            const { data } = await productAPI.searchProducts(searchRequest);

            if (data.success) {
                const content = data.data.content;
                setProducts((prev) => (append ? [...prev, ...content] : content));
                setHasMore(!data.data.last); // 마지막 페이지 여부

                setTotalCount(data.data.totalElements);
            }
        } catch (err) {
            console.error('상품 검색 실패:', err);
        } finally {
            setLoading(false);
        }
    };

    // ✅ 필터 바뀔 때마다 자동 호출 (가격은 제외!)
    useEffect(() => {
        setPage(0);
        fetchProducts(0, false); // 새 검색은 append 안 함
    }, [
        searchQuery,
        selectedCategory,
        selectedAgeGroups,
        selectedAddresses,
        excludeSoldOut,
        selectedStatuses,
        sortBy,
        appliedPriceRange, // ✅ "적용된 가격"만 의존성에 포함
    ]);

    // ✅ 무한 스크롤 옵저버
    const lastProductRef = useCallback(
        (node) => {
            if (loading) return;
            if (observerRef.current) observerRef.current.disconnect();

            observerRef.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => prev + 1);
                }
            });

            if (node) observerRef.current.observe(node);
        },
        [loading, hasMore]
    );

    // ✅ 페이지 번호 바뀔 때 추가 로드
    useEffect(() => {
        if (page > 0) {
            fetchProducts(page, true); // append 모드
        }
    }, [page]);

    return (
        <div className='search-product-search-page'>
            {/* 검색&필터 섹션 */}
            <section className='search-search-filter-section'>
                <div className='search-search-result-header'>
                    {isFromCategory ? (
                        <span className='search-search-result-text'>검색 결과</span>
                    ) : (
                        <>
                            <h1 className='search-search-query'>{searchQuery}</h1>
                            <span className='search-search-result-text'>검색 결과</span>
                            <span className='search-total-count'>총 {totalCount.toLocaleString()}개</span>
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
                                    <span onClick={() => handleBreadcrumbClick(index)} style={{ cursor: 'pointer' }}>
                                        {item}
                                    </span>
                                    {index < categoryPath.length - 1 && <span className='search-separator'>&gt;</span>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 세부 카테고리 */}
                {isCategoryExpanded &&
                    ((categoryPath.length === 1 && categories.length > 0) ||
                        (categoryPath.length > 1 && getCurrentCategory()?.children?.length > 0)) && (
                        <div className='search-filter-section expanded'>
                            <div className='search-filter-header'>
                                <div className='search-filter-placeholder'></div>
                            </div>
                            <div className='search-filter-content'>
                                <div className='search-category-grid'>
                                    {categoryPath.length === 1 ? (
                                        categories.map((category) => (
                                            <div key={category.id} className='search-category-item'>
                                                <span
                                                    className={selectedCategory === category.name ? 'selected' : ''}
                                                    onClick={() => handleCategoryClick(category)}
                                                >
                                                    {category.name}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className='search-sub-categories-container'>
                                            {getCurrentCategory()?.children?.map((subCategory) => (
                                                <div key={subCategory.id} className='search-category-item'>
                                                    <span
                                                        className={`search-sub-category-item ${
                                                            selectedCategory === subCategory.name ? 'selected' : ''
                                                        }`}
                                                        onClick={() => handleCategoryClick(subCategory)}
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
                            {Object.entries(AgeGroupText).map(([enumKey, label]) => (
                                <label key={enumKey} className='search-checkbox-item'>
                                    <input
                                        type='checkbox'
                                        checked={selectedAgeGroups.includes(enumKey)}
                                        onChange={() => toggleAgeGroup(enumKey)}
                                        className='search-checkbox-input'
                                    />
                                    <span className='search-checkbox-text'>{label}</span>
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
                            <button className='search-apply-button' onClick={() => setAppliedPriceRange(priceRange)}>
                                적용
                            </button>
                        </div>
                    </div>
                </div>

                {/* 지역 필터 */}
                <div className='search-filter-section expanded'>
                    <div className='search-filter-header'>
                        <h3>지역</h3>
                    </div>
                    <div className='search-filter-content'>
                        <AddressSearch onChange={setSelectedAddresses} />
                    </div>
                </div>

                {/* 옵션 필터 */}
                <div className='search-filter-section'>
                    <div className='search-filter-header'>
                        <h3>옵션</h3>
                    </div>
                    <div className='search-filter-content'>
                        <div className='search-checkbox-group'>
                            {/* 판매완료 제외 */}
                            <label className='search-checkbox-item'>
                                <input
                                    type='checkbox'
                                    checked={excludeSoldOut}
                                    onChange={toggleExcludeSoldOut}
                                    className='search-checkbox-input'
                                />
                                <span className='search-checkbox-text'>판매완료 상품 제외</span>
                            </label>
                            {/* 새상품 / 중고 */}
                            {Object.entries(ProductStatusText).map(([status, label]) => (
                                <label key={status} className='search-checkbox-item'>
                                    <input
                                        type='checkbox'
                                        checked={selectedStatuses.includes(status)}
                                        onChange={() => toggleStatus(status)}
                                        className='search-checkbox-input'
                                    />
                                    <span className='search-checkbox-text'>{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 정렬 섹션 */}
            <section className='search-sort-section'>
                <div className='search-sort-options'>
                    {Object.entries(SortOptionText).map(([key, label], index, arr) => (
                        <React.Fragment key={key}>
                            <button
                                className={`search-sort-option ${sortBy === key ? 'active' : ''}`}
                                onClick={() => setSortBy(key)}
                            >
                                {label}
                            </button>
                            {index < arr.length - 1 && <span className='search-sort-separator'>|</span>}
                        </React.Fragment>
                    ))}
                </div>
            </section>

            {/* 상품 섹션 */}
            <section className='search-products-section'>
                <div className='search-products-grid'>
                    {products.map((product, index) => {
                        if (index === products.length - 1) {
                            return (
                                <div ref={lastProductRef} key={product.id}>
                                    <ProductCard product={product} size='size3' />
                                </div>
                            );
                        } else {
                            return <ProductCard key={product.id} product={product} size='size3' />;
                        }
                    })}
                </div>
                {/* {loading && <div className='loading-spinner'>로딩중...</div>} */}
            </section>
        </div>
    );
}
