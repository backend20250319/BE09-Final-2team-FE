"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "./form.css";
import AddressSearch from "../components/AddressSearch";
import { useCategoryStore } from "@/store/categoryStore";

import { productAPI, fileAPI } from "@/lib/api"; // API import
import { TradeStatus } from "@/enums/tradeStatus";
import { AgeGroup, AgeGroupText } from "@/enums/ageGroup";
import ConfirmModal, { MODAL_TYPES } from "@/components/common/ConfirmModal";

const ProductForm = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type"); // 'regist' 또는 'modify'
  const productId = searchParams.get("productId"); // 수정 시 상품 번호

  const router = useRouter();

  const categories = useCategoryStore((s) => s.categories);

  const [formData, setFormData] = useState({
    images: [], // File | {id, url}
    productName: "",
    categoryId: null,
    price: "",
    description: "",
    productStatus: "USED",
    ageRange: "",
    locations: [],
    hashtags: [],
  });

  const [imageCount, setImageCount] = useState(0);
  const [hashtagInput, setHashtagInput] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [showHashtagWarning, setShowHashtagWarning] = useState(false);

  // 지역 선택 값 상태
  const [selectedAddresses, setSelectedAddresses] = useState([]);

  // 모달 상태 관리
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 로딩 상태 관리
  const [isLoading, setIsLoading] = useState(false);

  // 수정/등록 여부
  const isModifyMode = type === "modify";

  // ✅ 수정 모드일 때 기존 데이터 로드
  useEffect(() => {
    const fetchProduct = async () => {
      if (isModifyMode && productId) {
        const { data } = await productAPI.getProduct(productId);
        if (data.success) {
          const product = data.data;
          setFormData({
            images: product.images.map((img) => ({
              id: img.imageFileId,
              url: img.url,
            })), // ✅ 기존 이미지
            productName: product.name,
            categoryId: product.categoryId,
            price: product.price.toLocaleString(),
            description: product.content,
            productStatus: product.productStatus,
            ageRange: product.recommendedAge,
            locations: product.tradeAreas, // [{id, name}, …] 형태라 가정
            hashtags: product.hashtags,
          });
          setImageCount(product.images.length);
        }
      }
    };
    fetchProduct();
  }, [isModifyMode, productId]);

  // 카테고리 초기값 설정
  useEffect(() => {
    if (categories.length > 0) {
      setSelectedMainCategory(categories[0]);
      setSelectedSubCategory(categories[0].children[0] || null);
      setFormData((prev) => ({
        ...prev,
        mainCategory: categories[0].name,
        subCategory: categories[0].children[0]?.name || "",
      }));
    }
  }, [categories]);

  // 이미지 업로드 핸들러
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = formData.images.length + files.length;

    if (totalImages > 10) {
      alert("이미지는 최대 10개까지 업로드할 수 있습니다.");
      e.target.value = "";
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files], // File 객체 추가
    }));
    setImageCount(totalImages);
    e.target.value = "";
  };

  // 이미지 삭제
  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImageCount((prev) => prev - 1);
  };

  // 이미지 표시 src 결정
  const getImageSrc = (img) => {
    if (img instanceof File) {
      return URL.createObjectURL(img);
    }
    return img.url;
  };

  // 연령대 변경
  const handleAgeRangeChange = (age) => {
    setFormData((prev) => ({
      ...prev,
      ageRange: age,
    }));
  };

  // 가격 입력
  const handlePriceChange = (value) => {
    // 숫자가 아닌 문자 제거
    const numericValue = value.replace(/[^0-9]/g, "");

    if (numericValue === "") {
      setFormData((prev) => ({ ...prev, price: "" }));
      return;
    }

    // 천 단위 구분자 추가
    const formattedValue = parseInt(numericValue).toLocaleString();
    setFormData((prev) => ({ ...prev, price: formattedValue }));
  };

  // 해시태그
  const addHashtag = () => {
    if (hashtagInput.trim() && !hashtagInput.startsWith("#")) {
      if (formData.hashtags.length >= 10) {
        setShowHashtagWarning(true);
        setTimeout(() => setShowHashtagWarning(false), 3000);
        return;
      }
      setFormData((prev) => ({
        ...prev,
        hashtags: [...prev.hashtags, `#${hashtagInput.trim()}`],
      }));
      setHashtagInput("");
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

    const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"));
    const totalImages = formData.images.length + files.length;

    if (totalImages > 10) {
      alert("이미지는 최대 10개까지 업로드할 수 있습니다.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
    setImageCount(totalImages);
  };

  // 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 로딩 시작
    setIsLoading(true);

    try {
      let imageFileIds = [];

      for (const img of formData.images) {
        if (img instanceof File) {
          // 신규 업로드 파일
          const { data } = await fileAPI.upload([img]); // 파일 하나씩 업로드
          if (data.success && data.data.length > 0) {
            imageFileIds.push(data.data[0].id);
          }
        } else {
          // 기존 이미지
          imageFileIds.push(img.id);
        }
      }

      const submitData = {
        categoryId: formData.categoryId,
        name: formData.productName,
        content: formData.description,
        price: formData.price ? parseInt(formData.price.replace(/,/g, "")) : 0,
        productStatus: formData.productStatus,
        tradeStatus: TradeStatus.ON_SALE,
        recommendedAge: formData.ageRange,
        imageFileIds: imageFileIds, // formData.images 순서 그대로
        areaIds: selectedAddresses.map((l) => l.id),
        hashtags: formData.hashtags.map((h) => h.replace("#", "")),
      };

      console.log("submitData: ", submitData);

      if (isModifyMode) {
        await productAPI.updateProduct(productId, submitData);
      } else {
        await productAPI.createProduct(submitData);
      }

      // 등록 완료 모달 표시
      setShowSuccessModal(true);
    } catch (error) {
      console.error("상품 등록 중 오류 발생:", error);
      alert("상품 등록 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      // 로딩 종료
      setIsLoading(false);
    }
  };

  // 모달 확인 버튼 클릭 시 메인페이지로 이동
  const handleModalConfirm = () => {
    setShowSuccessModal(false);
    router.push("/");
  };

  // 메인 카테고리 변경
  const handleMainCategoryChange = (category) => {
    setSelectedMainCategory(category);
    const firstSub = category.children[0] || null;
    setSelectedSubCategory(firstSub);
    setFormData((prev) => ({
      ...prev,
      categoryId: firstSub ? firstSub.id : category.id, // 하위 있으면 하위 id, 없으면 부모 id
    }));
  };

  // 서브 카테고리 변경
  const handleSubCategoryChange = (category) => {
    setSelectedSubCategory(category);
    setFormData((prev) => ({
      ...prev,
      categoryId: category.id,
    }));
  };

  return (
    <div className="product-form-container">
      <div className="product-form-section">
        {/* 이미지 등록 섹션 */}
        <div
          className="image-upload-section"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className={`image-upload-grid ${isDragOver ? "drag-over" : ""}`}>
            {/* 첫 번째 이미지 업로드 영역 */}
            <div className="image-upload-item primary">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="image-upload-input"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="image-upload-label">
                <div className="camera-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M2 6C2 4.89543 2.89543 4 4 4H6.5L7.5 2H16.5L17.5 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6Z"
                      stroke="#999999"
                      strokeWidth="2"
                    />
                    <circle cx="12" cy="13" r="3" stroke="#999999" strokeWidth="2" />
                  </svg>
                </div>
                <span className="image-count">{imageCount}/10</span>
              </label>
            </div>

            {/* 업로드된 이미지들 */}
            {formData.images.map((image, index) => (
              <div key={index} className="image-upload-item uploaded">
                <img
                  src={image instanceof File ? URL.createObjectURL(image) : image.url} // 기존 vs 신규 구분
                  alt={`이미지 ${index + 1}`}
                  className="uploaded-image"
                />
                <button type="button" className="remove-image-btn" onClick={() => removeImage(index)}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="8" fill="white" />
                    <path d="M5 5L11 11M5 11L11 5" stroke="#000000" strokeWidth="1" />
                  </svg>
                </button>
              </div>
            ))}

            {/* 빈 이미지 슬롯들은 표시하지 않음 - 사진이 업로드될 때만 추가됨 */}
          </div>
        </div>

        {/* 상품명 입력 */}
        <div className="form-field">
          <div className="input-container">
            <input
              type="text"
              placeholder="상품명 (20자 이내)"
              value={formData.productName}
              onChange={(e) => setFormData((prev) => ({ ...prev, productName: e.target.value }))}
              className="form-input"
            />
          </div>
        </div>

        {/* 카테고리 선택 */}
        <div className="form-field">
          <div className="category-container">
            {/* 상위 카테고리 */}
            <div className="main-category-section">
              <div className="main-category-list">
                {categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      className={`main-category-item ${
                        selectedMainCategory && selectedMainCategory.id === category.id ? "selected" : ""
                      }`}
                      onClick={() => handleMainCategoryChange(category)}
                    >
                      {category.name}
                    </button>
                  ))
                ) : (
                  <div className="no-categories">카테고리를 불러오는 중...</div>
                )}
              </div>
            </div>

            {/* 하위 카테고리 */}
            <div className="sub-category-section">
              <div className="sub-category-list">
                {selectedMainCategory && selectedMainCategory.children ? (
                  selectedMainCategory.children.map((subCategory) => (
                    <button
                      key={subCategory.id}
                      type="button"
                      className={`sub-category-item ${
                        selectedSubCategory && selectedSubCategory.id === subCategory.id ? "selected" : ""
                      }`}
                      onClick={() => handleSubCategoryChange(subCategory)}
                    >
                      {subCategory.name}
                    </button>
                  ))
                ) : (
                  <div className="no-subcategories">하위 카테고리가 없습니다.</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 가격 입력 */}
        <div className="form-field">
          <div className="input-container">
            <span className="currency-symbol">₩</span>
            <input
              type="text"
              placeholder="판매가격"
              value={formData.price}
              onChange={(e) => handlePriceChange(e.target.value)}
              onKeyDown={(e) => {
                // 숫자, 백스페이스, 방향키, 탭, 엔터만 허용
                if (
                  !/[0-9]/.test(e.key) &&
                  !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(e.key)
                ) {
                  e.preventDefault();
                }
              }}
              className="form-input"
            />
          </div>
        </div>

        {/* 상품 설명 */}
        <div className="form-field">
          <div className="textarea-container">
            <textarea
              placeholder={`- 상품명(브랜드)
- 사용(유효) 기간
- 거래 방법
* 실제 촬영한 사진과 함께 상세 정보를 입력해주세요.`}
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="form-textarea"
              maxLength={1000}
            />
            <div className="character-count">{formData.description.length} / 1000</div>
          </div>
        </div>

        {/* 상품 상태 */}
        <div className="form-field">
          <h3 className="field-title">상품상태</h3>
          <div className="status-options">
            <button
              type="button"
              className={`status-option ${formData.productStatus === "USED" ? "selected" : ""}`}
              onClick={() => setFormData((prev) => ({ ...prev, productStatus: "USED" }))}
            >
              중고
            </button>
            <button
              type="button"
              className={`status-option ${formData.productStatus === "NEW" ? "selected" : ""}`}
              onClick={() => setFormData((prev) => ({ ...prev, productStatus: "NEW" }))}
            >
              새상품
            </button>
          </div>
        </div>

        <div className="divider"></div>

        {/* 추천 연령대 */}
        <div className="form-field">
          <h3 className="field-title">추천 연령대</h3>
          <div className="age-range-options">
            {Object.entries(AgeGroupText).map(([enumKey, label]) => (
              <label key={enumKey} className="age-option">
                <input
                  type="radio"
                  name="ageRange"
                  value={enumKey} // ✅ enum 값 그대로
                  checked={formData.ageRange === enumKey}
                  onChange={() =>
                    setFormData((prev) => ({
                      ...prev,
                      ageRange: enumKey, // ✅ 상태에는 enum 값만 저장
                    }))
                  }
                  className="age-radio"
                />
                <div className="age-radio-icon">
                  {formData.ageRange === enumKey ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect width="16" height="16" rx="2" fill="#85B3EB" />
                      <path
                        d="M4 8L7 11L12 5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect width="16" height="16" rx="2" fill="white" stroke="#999999" strokeWidth="1" />
                    </svg>
                  )}
                </div>
                <span className="age-text">{label}</span> {/* ✅ AgeGroupText[enumKey] */}
              </label>
            ))}
          </div>
        </div>

        <div className="divider"></div>

        {/* 거래지역 */}
        <div className="form-field">
          <h3 className="field-title">거래지역</h3>
          <AddressSearch onChange={setSelectedAddresses} />
        </div>

        <div className="divider"></div>

        {/* 해시태그 */}
        <div className="form-field">
          <h3 className="field-title">해시태그</h3>
          <div className="hashtag-input-container">
            <input
              type="text"
              placeholder="해시태그를 입력해주세요 (선택)"
              value={hashtagInput}
              onChange={(e) => setHashtagInput(e.target.value)}
              className="hashtag-input"
              onKeyPress={(e) => e.key === "Enter" && addHashtag()}
            />
          </div>

          {showHashtagWarning && (
            <div className="product-hashtag-warning">
              <span>최대 10개까지 설정 가능합니다.</span>
            </div>
          )}

          {/* 선택된 해시태그들 */}
          <div className="selected-hashtags">
            {formData.hashtags.map((hashtag, index) => (
              <div key={index} className="hashtag-tag">
                <span>{hashtag}</span>
                <button type="button" onClick={() => removeHashtag(index)} className="remove-hashtag-btn">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5" stroke="#FFFFFF" strokeWidth="2" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="divider"></div>

        {/* 약관 동의 */}
        <div className="terms-agreement">
          <div className="agreement-label">
            <div className="agreement-icon">
              <img src="/images/product/check-circle.svg" alt="약관 동의" width="20" height="20" />
            </div>
            <span className="agreement-text">
              판매 정보가 실제 상품과 다를 경우, 책임은 판매자에게 있음을 동의합니다.
            </span>
          </div>
        </div>

        {/* 제출 버튼 */}
        <button type="submit" onClick={handleSubmit} className="product-form-submit-button" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 h-full">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{isModifyMode ? "수정 중..." : "등록 중..."}</span>
            </div>
          ) : isModifyMode ? (
            "수정하기"
          ) : (
            "판매하기"
          )}
        </button>
      </div>

      {/* 등록 완료 모달 */}
      <ConfirmModal
        open={showSuccessModal}
        title="등록 완료"
        message="상품이 성공적으로 등록되었습니다."
        onConfirm={handleModalConfirm}
        type={MODAL_TYPES.CONFIRM_ONLY}
        confirmText="확인"
      />
    </div>
  );
};

export default ProductForm;
