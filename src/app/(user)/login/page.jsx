"use client";

import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './login.css';
import { useUserStore } from '@/store/userStore';

export default function Login() {
    const router = useRouter();

    // Zustand store 에서 로그인 함수들 가져오기
    const { tempLogin, tempKakaoLogin, checkAuthStatus } = useUserStore();

    // 로그인 폼 상태
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    // 로딩 및 에러 상태
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // 이미 로그인된 경우 메인으로 리다이렉트
    useEffect(() => {
        if (checkAuthStatus()) {
            router.push('/');
        }
    }, [checkAuthStatus, router]);

    // 입력값에 따른 버튼 활성화/비활성화
    useEffect(() => {
        if (userId.trim() !== '' && password.trim() !== '') {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [userId, password]);

    // 아이디 입력 변경 핸들러
    const handleUserIdChange = (e) => {
        setUserId(e.target.value);
        setErrorMessage(''); // 입력 시 에러 메시지 초기화
    };

    // 비밀번호 입력 변경 핸들러
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setErrorMessage(''); // 입력 시 에러 메시지 초기화
    };

    // 일반 로그인 제출 핸들러
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isButtonDisabled) {
            alert("아이디와 비밀번호를 모두 입력해주세요");
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        try {
            // 임시 로그인 API 호출
            const result = await tempLogin(userId, password);

            if (result.success) {
                // 로그인 성공 - 메인 페이지로 이동
                router.push('/');
            } else {
                // 로그인 실패 - 에러 메시지 표시
                setErrorMessage(result.message);
            }
        } catch (error) {
            setErrorMessage('로그인 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    // 카카오 로그인 핸들러
    const handleKakaoLogin = async () => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            // 임시 카카오 데이터 (실제로는 카카오 SDK 사용)
            const dummyKakaoData = {
                id: 'kakao_' + Date.now(),
                nickname: '카카오 프로필 닉네임',
                email: 'user@kakao.com'
            };

            const result = await tempKakaoLogin(dummyKakaoData);

            if (result.success) {
                if (result.isNewUser) {
                    // 신규 사용자 - 추가정보 입력 페이지로
                    router.push('/additional-info');
                } else {
                    // 기존 사용자 - 메인으로
                    router.push('/');
                }
            } else {
                setErrorMessage(result.message);
            }
        } catch (error) {
            setErrorMessage('카카오 로그인 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-root">
            <div className="login-card">
                {/* 메인 로고 */}
                <Link href="/">
                    <img src="/images/common/main-logo.png" alt="main visual" className="login-main-image" />
                </Link>

                {/* 로그인 폼 */}
                <form className="login-form" onSubmit={handleSubmit}>
                    <input
                        className="login-input"
                        type="text"
                        placeholder="아이디를 입력해 주세요."
                        value={userId}
                        onChange={handleUserIdChange}
                        disabled={isLoading}
                        required
                    />
                    <input
                        className="login-input"
                        type="password"
                        placeholder="비밀번호를 입력해 주세요."
                        value={password}
                        onChange={handlePasswordChange}
                        disabled={isLoading}
                        required
                    />

                    {/* 에러 메시지 표시 */}
                    {errorMessage && (
                        <div className="error-message">
                            ❌ {errorMessage}
                        </div>
                    )}

                    {/* 일반 로그인 버튼 */}
                    <button
                        className="login-btn"
                        type="submit"
                        disabled={isButtonDisabled || isLoading}
                    >
                        {isLoading ? '로그인 중...' : '로그인'}
                    </button>

                    {/* 카카오 로그인 버튼 */}
                    <div className="login-sns">
                        <button
                            className="sns-btn kakao"
                            type="button"
                            onClick={handleKakaoLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? '카카오 로그인 중...' : '카카오 아이디로 로그인'}
                        </button>
                    </div>
                </form>

                {/* 회원가입 및 찾기 링크 */}
                <div className="login-links">
                    <Link href="/signup" className="signup-link">계정이 없으신가요? 회원가입</Link>
                    <div className="find-links">
                        <a href="#" className="find-link">아이디 찾기</a>
                        <span className="divider"> | </span>
                        <a href="#" className="find-link">비밀번호 찾기</a>
                    </div>
                </div>
            </div>
        </div>
    );
}