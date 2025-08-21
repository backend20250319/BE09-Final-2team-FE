"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './login.css';
import { useIsAuthenticated, useTempLogin } from '@/store/userStore'; // 🔥 개별 훅 사용

export default function Login() {
    const router = useRouter();
    const isAuthenticated = useIsAuthenticated(); // 개별 훅 사용
    const tempLogin = useTempLogin(); // 로그인 함수만

    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // 이미 로그인된 경우만 리다이렉트 (무한 루프 방지)
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated]); // router는 Next.js에서 안정적이므로 생략 가능

    // 입력값에 따른 버튼 활성화/비활성화
    useEffect(() => {
        if (userId.trim() !== '' && password.trim() !== '') {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [userId, password]);

    const handleUserIdChange = (e) => {
        setUserId(e.target.value);
        setErrorMessage('');
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setErrorMessage('');
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
            const result = await tempLogin(userId, password);

            if (result.success) {
                console.log('✅ 로그인 성공, 메인 페이지로 이동');
                router.push('/');
            } else {
                setErrorMessage(result.message);
            }
        } catch (error) {
            setErrorMessage('로그인 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    // 카카오 로그인 핸들러 (임시)
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
                <Link href="/">
                    <img src="/images/common/main-logo.png" alt="main visual" className="login-main-image" />
                </Link>

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

                    {errorMessage && (
                        <div className="error-message">
                            ❌ {errorMessage}
                        </div>
                    )}

                    <button
                        className="login-btn"
                        type="submit"
                        disabled={isButtonDisabled || isLoading}
                    >
                        {isLoading ? '로그인 중...' : '로그인'}
                    </button>

                    <div className="login-sns">
                        <button
                            className="sns-btn kakao"
                            type="button"
                            onClick={handleKakaoLogin}
                            disabled={isLoading}
                        >
                            카카오 아이디로 로그인
                        </button>
                    </div>
                </form>

                <div className="login-links">
                    <Link href="/signup" className="signup-link">계정이 없으신가요? 회원가입</Link>
                    <div className="find-links">
                        <Link href="/find-account?tab=findId" className="find-link">아이디 찾기</Link>
                        <span className="divider"> | </span>
                        <Link href="/find-account?tab=findPassword" className="find-link">비밀번호 찾기</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}