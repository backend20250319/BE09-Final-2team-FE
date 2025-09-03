"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import "./additional-info.css";
import DaumPostcode from "react-daum-postcode";
import { processAddressData } from "@/app/(user)/components/addressUtils";
import { useUserStore } from "@/store/userStore";

export default function AdditionalInfo() {
  const router = useRouter();

  const { userInfo, updateUserInfo, processSignup } = useUserStore();

  // userInfo가 로드되지 않은 경우 로딩 표시
  if (!userInfo) {
    return (
      <div className="additional-info-container">
        <div className="additional-info-card">
          <div className="card-content">
            <div className="loading-message">로딩 중...</div>
          </div>
        </div>
      </div>
    );
  }

  // 카카오 원본 닉네임과 이메일
  const [kakaoUserInfo] = useState({
    nickname: userInfo?.kakaoNickname || "카카오닉네임",
    email: userInfo?.kakaoEmail || "kakaouser@kakao.com",
  });

  // 폼 입력 상태
  const [formData, setFormData] = useState({
    name: userInfo?.name || "",
    nickname: userInfo?.nickname || userInfo?.kakaoNickname || "",
    address: userInfo?.address || "",
    agreeToTerms: userInfo?.agreements?.privacy || false,
  });

  // 우편번호 모달 상태
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

  // 닉네임 유효성 검사 상태
  const [validationStates, setValidationStates] = useState({
    nickname: {
      status: "default",
      message: "💡 카카오 닉네임이 기본으로 설정됩니다. 원하시면 변경하실 수 있어요.",
      checked: false,
    },
  });

  // 폼 전체 유효성 상태
  const [isFormValid, setIsFormValid] = useState(false);

  // 닉네임 유효성 검사 함수 (중복 로직 제거)
  const validateNickname = (nickname, originalKakaoNickname) => {
    if (nickname === originalKakaoNickname) {
      return {
        status: "success",
        message: "✅ 카카오 닉네임이 설정되었습니다",
        checked: true,
      };
    }
    if (nickname.length < 2 || nickname.length > 10) {
      return {
        status: "error",
        message: "❌ 닉네임은 2~10자여야 합니다",
        checked: false,
      };
    }
    return {
      status: "default",
      message: "💡 중복 확인을 눌러주세요",
      checked: false,
    };
  };

  // 컴포넌트 마운트 시 유저 정보 초기화
  useEffect(() => {
    if (userInfo?.signupType !== "kakao") {
      updateUserInfo({
        ...userInfo,
        name: "",
        loginId: "",
        password: "",
        nickname: userInfo?.kakaoNickname || "카카오닉네임",
        email: userInfo?.kakaoEmail || "kakaouser@kakao.com",
        phone: "",
        address: "",
        signupType: "kakao",
        agreements: { terms: false, privacy: false, age: false, location: false, push: false },
      });
    }
  }, [userInfo, updateUserInfo]);

  // 닉네임 입력 시 유효성 검사 실행
  useEffect(() => {
    const originalKakaoNickname = userInfo?.kakaoNickname || "카카오닉네임";
    const result = validateNickname(formData.nickname, originalKakaoNickname);
    setValidationStates((prev) => ({ ...prev, nickname: result }));
  }, [formData.nickname, userInfo?.kakaoNickname]);

  // 폼 유효성 상태 업데이트
  useEffect(() => {
    const isFieldsValid = ["name", "nickname", "address"].every((field) => formData[field].trim() !== "");
    const isNicknameValid = validationStates.nickname.checked;
    const isAgreementValid = formData.agreeToTerms;
    setIsFormValid(isFieldsValid && isNicknameValid && isAgreementValid);
  }, [formData, validationStates]);

  // 폼 입력 변경 핸들러
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 동의 체크박스 변경 핸들러
  const handleAgreementChange = (checked) => {
    setFormData((prev) => ({ ...prev, agreeToTerms: checked }));
  };

  // 닉네임 중복 확인 (모의 API)
  const checkDuplicate = async (type, value) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const duplicates = { nickname: ["관리자", "테스트", "admin"] };
        const isDuplicate = duplicates[type]?.includes(value);
        resolve({ available: !isDuplicate, message: isDuplicate ? "이미 사용 중입니다" : "사용 가능합니다" });
      }, 1000);
    });
  };

  // 중복 확인 버튼 클릭 핸들러
  const handleDuplicateCheck = async () => {
    const value = formData.nickname;
    const originalKakaoNickname = userInfo?.kakaoNickname || "카카오닉네임";

    // 기본 닉네임은 중복 확인 없이 통과
    if (value === originalKakaoNickname) {
      setValidationStates((prev) => ({
        ...prev,
        nickname: { status: "success", message: "✅ 카카오 닉네임이 설정되었습니다", checked: true },
      }));
      return;
    }

    // 유효성 검사 및 중복 확인 API 호출
    const validationResult = validateNickname(value, originalKakaoNickname);
    if (validationResult.status === "error") {
      setValidationStates((prev) => ({ ...prev, nickname: validationResult }));
      return;
    }
    setValidationStates((prev) => ({
      ...prev,
      nickname: { status: "loading", message: "🔄 확인 중...", checked: false },
    }));

    try {
      const result = await checkDuplicate("nickname", value);
      setValidationStates((prev) => ({
        ...prev,
        nickname: {
          status: result.available ? "success" : "error",
          message: result.available ? "✅ 사용 가능한 닉네임입니다" : `❌ ${result.message}`,
          checked: result.available,
        },
      }));
    } catch (error) {
      setValidationStates((prev) => ({
        ...prev,
        nickname: { status: "error", message: "❌ 확인 중 오류가 발생했습니다", checked: false },
      }));
    }
  };

  // 주소 검색 모달 완료 핸들러
  const handleAddressComplete = (data) => {
    const processedAddress = processAddressData(data, true); // 도로명 주소
    handleInputChange("address", processedAddress);
    setIsPostcodeOpen(false);
  };

  // 주소 검색 버튼 클릭 핸들러
  const handleAddressSearch = () => setIsPostcodeOpen(true);

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid && userInfo) {
      const finalUserData = {
        ...userInfo,
        ...formData,
        agreements: { ...userInfo.agreements, privacy: formData.agreeToTerms },
      };
      updateUserInfo(finalUserData);
      processSignup(finalUserData);
      router.push("/signup/complete?from=kakao");
    }
  };

  return (
    <div className="additional-info-container">
      <div className="additional-info-card">
        <div className="card-content">
          <Link href="/">
            <div className="image-container">
              <img src="/images/common/main-logo.png" alt="Momnect 로고" className="logo-image" />
            </div>
          </Link>
          <h1 className="page-title">추가정보 입력</h1>
          <div className="welcome-message-container">
            <span className="welcome-nickname">🎉 {kakaoUserInfo.nickname}님, 환영합니다!</span>
            <br />
            <span className="welcome-subtitle">가입 완료를 위해 정보를 입력해주세요</span>
          </div>

          <form className="form-container" onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                className="input-field"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="이름을 입력하세요"
                required
              />
            </div>
            <div className="input-group">
              <input
                className={`input-field ${validationStates.nickname.status}`}
                type="text"
                value={formData.nickname}
                onChange={(e) => handleInputChange("nickname", e.target.value)}
                placeholder="닉네임을 입력하세요 (필수, 2~10자)"
                required
              />
              <button
                className="duplicate-check-btn"
                type="button"
                onClick={handleDuplicateCheck}
                disabled={validationStates.nickname.status === "loading"}
              >
                {validationStates.nickname.status === "loading" ? "확인중..." : "중복 확인"}
              </button>
            </div>
            <div className={`validation-message ${validationStates.nickname.status}`}>
              {validationStates.nickname.message}
            </div>
            <div className="input-group">
              <input
                className="input-field"
                type="text"
                value={formData.address}
                placeholder="주소를 검색하세요"
                onClick={handleAddressSearch}
                readOnly
                required
              />
              {!formData.address && (
                <button className="address-search-btn" type="button" onClick={handleAddressSearch}>
                  주소 검색
                </button>
              )}
            </div>
            <div className="agreement-container">
              <label className="checkbox-label">
                <input
                  className="checkbox-input"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleAgreementChange(e.target.checked)}
                />
                <span className="checkbox-custom">{formData.agreeToTerms && <span className="checkmark">✓</span>}</span>
                <span className="agreement-text">개인정보 수집 이용에 동의합니다</span>
              </label>
            </div>
            <button
              className={`submit-button ${isFormValid ? "active" : ""}`}
              type="submit"
              disabled={!isFormValid}
              style={{
                backgroundColor: isFormValid ? "#85B3EB" : "#CBD5E1",
                cursor: isFormValid ? "pointer" : "not-allowed",
                transition: "all 0.3s ease",
              }}
            >
              가입 완료
            </button>
          </form>
        </div>
      </div>
      {isPostcodeOpen && (
        <div className="postcode-overlay">
          <div className="postcode-modal">
            <div className="postcode-header">
              <h3>주소 검색</h3>
              <button className="postcode-close" onClick={() => setIsPostcodeOpen(false)}>
                ×
              </button>
            </div>
            <DaumPostcode
              onComplete={handleAddressComplete}
              autoClose={false}
              style={{ width: "100%", height: "400px" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
