'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import './form.css';

const ProductForm = () => {
    const searchParams = useSearchParams();
    const type = searchParams.get('type'); // 'regist' 또는 'modify'
    const productId = searchParams.get('productId'); // 수정 시 상품 번호

    const [formData, setFormData] = useState({
        images: [],
        productName: '',
        mainCategory: '출산/육아용품',
        subCategory: '모유수유용품',
        price: '',
        description: '',
        productStatus: 'USED', // 'NEW' 또는 'USED'
        ageRange: '',
        locations: [],
        hashtags: [],
    });

    const [imageCount, setImageCount] = useState(0);
    const [hashtagInput, setHashtagInput] = useState('');
    const [locationInput, setLocationInput] = useState('');
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [selectedMainCategory, setSelectedMainCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);

    // 수정 모드일 때 기존 데이터 로드
    useEffect(() => {
        if (type === 'modify' && productId) {
            // TODO: API 호출로 기존 상품 데이터 로드
            console.log('수정 모드:', productId);
        }
    }, [type, productId]);

    // 카테고리 초기값 설정
    useEffect(() => {
        if (categories.length > 0) {
            setSelectedMainCategory(categories[0]);
            setSelectedSubCategory(categories[0].children[0]);
        }
    }, []);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const totalImages = formData.images.length + files.length;

        if (totalImages > 10) {
            alert('이미지는 최대 10개까지 업로드할 수 있습니다.');
            // input 초기화
            e.target.value = '';
            return;
        }

        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...files],
        }));
        setImageCount(totalImages);

        // input 초기화 (같은 파일을 다시 선택할 수 있도록)
        e.target.value = '';
    };

    const removeImage = (index) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
        setImageCount((prev) => prev - 1);
    };

    const handleAgeRangeChange = (age) => {
        setFormData((prev) => ({
            ...prev,
            ageRange: age,
        }));
    };

    const handlePriceChange = (value) => {
        // 숫자가 아닌 문자 제거
        const numericValue = value.replace(/[^0-9]/g, '');

        if (numericValue === '') {
            setFormData((prev) => ({ ...prev, price: '' }));
            return;
        }

        // 천 단위 구분자 추가
        const formattedValue = parseInt(numericValue).toLocaleString();
        setFormData((prev) => ({ ...prev, price: formattedValue }));
    };

    const addLocation = () => {
        if (locationInput.trim() && formData.locations.length < 3) {
            setFormData((prev) => ({
                ...prev,
                locations: [...prev.locations, locationInput.trim()],
            }));
            setLocationInput('');
        }
    };

    const removeLocation = (index) => {
        setFormData((prev) => ({
            ...prev,
            locations: prev.locations.filter((_, i) => i !== index),
        }));
    };

    const addHashtag = () => {
        if (hashtagInput.trim() && formData.hashtags.length < 10 && !hashtagInput.startsWith('#')) {
            setFormData((prev) => ({
                ...prev,
                hashtags: [...prev.hashtags, `#${hashtagInput.trim()}`],
            }));
            setHashtagInput('');
        }
    };

    const removeHashtag = (index) => {
        setFormData((prev) => ({
            ...prev,
            hashtags: prev.hashtags.filter((_, i) => i !== index),
        }));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith('image/'));
        const totalImages = formData.images.length + files.length;

        if (totalImages > 10) {
            alert('이미지는 최대 10개까지 업로드할 수 있습니다.');
            return;
        }

        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...files],
        }));
        setImageCount(totalImages);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!agreeToTerms) {
            alert('약관에 동의해주세요.');
            return;
        }

        // 가격 데이터에서 천 단위 구분자 제거하고 숫자로 변환
        const submitData = {
            ...formData,
            price: formData.price ? parseInt(formData.price.replace(/,/g, '')) : 0,
        };

        // TODO: API 호출로 상품 등록/수정
        console.log('제출된 데이터:', submitData);
    };

    const isModifyMode = type === 'modify';

    // 카테고리 데이터
    const categories = [
        {
            id: 1,
            name: '출산/육아용품',
            parentId: null,
            children: [
                { id: 101, name: '모유수유용품', parentId: 1, children: [] },
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

    const handleMainCategoryChange = (category) => {
        setSelectedMainCategory(category);
        // 하위카테고리를 첫 번째 항목으로 자동 설정
        const firstSubCategory = category.children[0];
        setSelectedSubCategory(firstSubCategory);
        setFormData((prev) => ({
            ...prev,
            mainCategory: category.name,
            subCategory: firstSubCategory ? firstSubCategory.name : '',
        }));
    };

    const handleSubCategoryChange = (category) => {
        setSelectedSubCategory(category);
        setFormData((prev) => ({
            ...prev,
            subCategory: category.name,
        }));
    };

    return (
        <div className='product-form-container'>
            <div className='product-form-section'>
                {/* 이미지 등록 섹션 */}
                <div
                    className='image-upload-section'
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className={`image-upload-grid ${isDragOver ? 'drag-over' : ''}`}>
                        {/* 첫 번째 이미지 업로드 영역 */}
                        <div className='image-upload-item primary'>
                            <input
                                type='file'
                                accept='image/*'
                                multiple
                                onChange={handleImageUpload}
                                className='image-upload-input'
                                id='image-upload'
                            />
                            <label htmlFor='image-upload' className='image-upload-label'>
                                <div className='camera-icon'>
                                    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
                                        <path
                                            d='M2 6C2 4.89543 2.89543 4 4 4H6.5L7.5 2H16.5L17.5 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6Z'
                                            stroke='#999999'
                                            strokeWidth='2'
                                        />
                                        <circle cx='12' cy='13' r='3' stroke='#999999' strokeWidth='2' />
                                    </svg>
                                </div>
                                <span className='image-count'>{imageCount}/10</span>
                            </label>
                        </div>

                        {/* 업로드된 이미지들 */}
                        {formData.images.map((image, index) => (
                            <div key={index} className='image-upload-item uploaded'>
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt={`이미지 ${index + 1}`}
                                    className='uploaded-image'
                                />
                                <button type='button' className='remove-image-btn' onClick={() => removeImage(index)}>
                                    <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                                        <circle cx='8' cy='8' r='8' fill='white' />
                                        <path d='M5 5L11 11M5 11L11 5' stroke='#000000' strokeWidth='1' />
                                    </svg>
                                </button>
                            </div>
                        ))}

                        {/* 빈 이미지 슬롯들은 표시하지 않음 - 사진이 업로드될 때만 추가됨 */}
                    </div>
                </div>

                {/* 상품명 입력 */}
                <div className='form-field'>
                    <div className='input-container'>
                        <input
                            type='text'
                            placeholder='상품명 (30자 이내)'
                            value={formData.productName}
                            onChange={(e) => setFormData((prev) => ({ ...prev, productName: e.target.value }))}
                            className='form-input'
                        />
                    </div>
                </div>

                {/* 카테고리 선택 */}
                <div className='form-field'>
                    <div className='category-container'>
                        {/* 상위 카테고리 */}
                        <div className='main-category-section'>
                            <div className='main-category-list'>
                                {categories && categories.length > 0 ? (
                                    categories.map((category) => (
                                        <button
                                            key={category.id}
                                            type='button'
                                            className={`main-category-item ${
                                                selectedMainCategory && selectedMainCategory.id === category.id
                                                    ? 'selected'
                                                    : ''
                                            }`}
                                            onClick={() => handleMainCategoryChange(category)}
                                        >
                                            {category.name}
                                        </button>
                                    ))
                                ) : (
                                    <div className='no-categories'>카테고리를 불러오는 중...</div>
                                )}
                            </div>
                        </div>

                        {/* 하위 카테고리 */}
                        <div className='sub-category-section'>
                            <div className='sub-category-list'>
                                {selectedMainCategory && selectedMainCategory.children ? (
                                    selectedMainCategory.children.map((subCategory) => (
                                        <button
                                            key={subCategory.id}
                                            type='button'
                                            className={`sub-category-item ${
                                                selectedSubCategory && selectedSubCategory.id === subCategory.id
                                                    ? 'selected'
                                                    : ''
                                            }`}
                                            onClick={() => handleSubCategoryChange(subCategory)}
                                        >
                                            {subCategory.name}
                                        </button>
                                    ))
                                ) : (
                                    <div className='no-subcategories'>하위 카테고리가 없습니다.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 가격 입력 */}
                <div className='form-field'>
                    <div className='input-container'>
                        <span className='currency-symbol'>₩</span>
                        <input
                            type='text'
                            placeholder='판매가격'
                            value={formData.price}
                            onChange={(e) => handlePriceChange(e.target.value)}
                            onKeyDown={(e) => {
                                // 숫자, 백스페이스, 방향키, 탭, 엔터만 허용
                                if (
                                    !/[0-9]/.test(e.key) &&
                                    !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key)
                                ) {
                                    e.preventDefault();
                                }
                            }}
                            className='form-input'
                        />
                    </div>
                </div>

                {/* 상품 설명 */}
                <div className='form-field'>
                    <div className='textarea-container'>
                        <textarea
                            placeholder={`- 상품명(브랜드)
- 사용(유효) 기간
- 거래 방법
* 실제 촬영한 사진과 함께 상세 정보를 입력해주세요.`}
                            value={formData.description}
                            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                            className='form-textarea'
                            maxLength={1000}
                        />
                        <div className='character-count'>{formData.description.length} / 1000</div>
                    </div>
                </div>

                {/* 상품 상태 */}
                <div className='form-field'>
                    <h3 className='field-title'>상품상태</h3>
                    <div className='status-options'>
                        <button
                            type='button'
                            className={`status-option ${formData.productStatus === 'USED' ? 'selected' : ''}`}
                            onClick={() => setFormData((prev) => ({ ...prev, productStatus: 'USED' }))}
                        >
                            중고
                        </button>
                        <button
                            type='button'
                            className={`status-option ${formData.productStatus === 'NEW' ? 'selected' : ''}`}
                            onClick={() => setFormData((prev) => ({ ...prev, productStatus: 'NEW' }))}
                        >
                            새상품
                        </button>
                    </div>
                </div>

                <div className='divider'></div>

                {/* 추천 연령대 */}
                <div className='form-field'>
                    <h3 className='field-title'>추천 연령대</h3>
                    <div className='age-range-options'>
                        {['0~6개월', '6~12개월', '1~2세', '2~4세', '4~6세', '6~8세', '8세 이상'].map((age) => (
                            <label key={age} className='age-option'>
                                <input
                                    type='radio'
                                    name='ageRange'
                                    value={age}
                                    checked={formData.ageRange === age}
                                    onChange={() => handleAgeRangeChange(age)}
                                    className='age-radio'
                                />
                                <div className='age-radio-icon'>
                                    {formData.ageRange === age ? (
                                        <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                                            <rect width='16' height='16' rx='2' fill='#85B3EB' />
                                            <path
                                                d='M4 8L7 11L12 5'
                                                stroke='white'
                                                strokeWidth='2'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                            />
                                        </svg>
                                    ) : (
                                        <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                                            <rect
                                                width='16'
                                                height='16'
                                                rx='2'
                                                fill='white'
                                                stroke='#999999'
                                                strokeWidth='1'
                                            />
                                        </svg>
                                    )}
                                </div>
                                <span className='age-text'>{age}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className='divider'></div>

                {/* 거래지역 */}
                <div className='form-field'>
                    <h3 className='field-title'>거래지역</h3>
                </div>

                <div className='divider'></div>

                {/* 해시태그 */}
                <div className='form-field'>
                    <h3 className='field-title'>해시태그</h3>
                    <div className='hashtag-input-container'>
                        <input
                            type='text'
                            placeholder='해시태그를 입력해주세요 (선택)'
                            value={hashtagInput}
                            onChange={(e) => setHashtagInput(e.target.value)}
                            className='hashtag-input'
                            onKeyPress={(e) => e.key === 'Enter' && addHashtag()}
                        />
                    </div>
                    <div className='hashtag-info'>
                        <span>최대 10개까지 설정 가능합니다.</span>
                    </div>

                    {/* 선택된 해시태그들 */}
                    <div className='selected-hashtags'>
                        {formData.hashtags.map((hashtag, index) => (
                            <div key={index} className='hashtag-tag'>
                                <span>{hashtag}</span>
                                <button
                                    type='button'
                                    onClick={() => removeHashtag(index)}
                                    className='remove-hashtag-btn'
                                >
                                    <svg width='14' height='14' viewBox='0 0 14 14' fill='none'>
                                        <path
                                            d='M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5'
                                            stroke='#FFFFFF'
                                            strokeWidth='2'
                                        />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='divider'></div>

                {/* 약관 동의 */}
                <div className='terms-agreement'>
                    <div className='agreement-label'>
                        <div className='agreement-icon'>
                            <img src='/images/product/check-circle.svg' alt='약관 동의' width='20' height='20' />
                        </div>
                        <span className='agreement-text'>
                            판매 정보가 실제 상품과 다를 경우, 책임은 판매자에게 있음을 동의합니다.
                        </span>
                    </div>
                </div>

                {/* 제출 버튼 */}
                <button type='submit' onClick={handleSubmit} className='submit-button' disabled={!agreeToTerms}>
                    {isModifyMode ? '수정하기' : '판매하기'}
                </button>
            </div>
        </div>
    );
};

export default ProductForm;
