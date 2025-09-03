"use client";

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import './signup-complete.css';
import { useUserStore } from '@/store/userStore';

const SignupComplete = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Zustand 스토어 사용
    const { userInfo, setLoginStatus } = useUserStore();

    // 직접 닉네임 계산
    const nickname = userInfo.nickname || userInfo.loginId || userInfo.name || userInfo.kakaoNickname || searchParams.get('nickname') || '사용자';
    const isFromKakao = userInfo.signupType === 'kakao' || searchParams.get('from') === 'kakao';

    // 동적 메시지 설정
    const getWelcomeMessages = () => {
        if (isFromKakao) {
            return {
                greeting: `${nickname}님, 환영합니다!`,
                subtitle: 'Momnect 가입이 완료되었습니다',
                description: '지금 바로 서비스를 이용해 보세요'
            };
        }
        return {
            greeting: `${nickname}님, 환영합니다!`,
            subtitle: 'Momnect 가입이 완료되었습니다',
            description: '지금 바로 서비스를 이용해 보세요'
        };
    };

    const messages = getWelcomeMessages();

    // 중복 실행 방지를 위한 useEffect 최적화
    useEffect(() => {
        let mounted = true;

        if (mounted && userInfo.signupStep === 3) {
            // 필요한 완료 처리 로직만 유지
        }

        return () => {
            mounted = false;
        };
    }, [userInfo.signupStep]);

    // 로그인 핸들러
    const handleLogin = () => {
        router.push('/login');
    };

    // 메인 페이지 이동
    const handleGoToMain = () => {
        router.push('/');
    };

    // 카카오 사용자용 서비스 시작하기
    const handleStartService = () => {
        setLoginStatus(true);
        router.push('/');
    };

    return (
        <div className="signup-complete-container">
            <div className="signup-complete-card">
                <div className="card-content">
                    {/* 이미지 */}
                    <Link href="/">
                        <div className="image-container">
                            <img
                                src="/images/common/main-logo.png"
                                alt="Momnect 로고"
                                className="completion-image"
                            />
                        </div>
                    </Link>

                    {/* 환영 메시지 */}
                    <div className="welcome-message">
                        <p>{messages.greeting}</p>
                        <p>{messages.subtitle}</p>
                        <p>{messages.description}</p>
                    </div>

                    {/* 조건부 버튼 렌더링 */}
                    {isFromKakao ? (
                        <button className="login-button service-start" onClick={handleStartService}>
                            서비스 시작하기
                        </button>
                    ) : (
                        <>
                            <button className="login-button" onClick={handleLogin}>
                                로그인 하기
                            </button>
                            <button className="main-page-link" onClick={handleGoToMain}>
                                메인 페이지로 가기
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SignupComplete;