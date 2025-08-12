"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // useSearchParams 추가
import Link from 'next/link';
import './signup-complete.css';

const SignupComplete = () => {
    const router = useRouter();
    const searchParams = useSearchParams(); // URL 파라미터 읽기

    // URL 에서 닉네임 받기
    const nickname = searchParams.get('nickname');
    const [userName] = useState(nickname || '만두님');

    // URL 파라미터로 플로우 구분
    const [fromSource, setFromSource] = useState('normal');

    useEffect(() => {
        const source = searchParams.get('from');
        setFromSource(source || 'normal');
    }, [searchParams]);

    // 플로우별 설정
    const isFromKakao = fromSource === 'kakao';

    // 동적 메시지 설정
    const getWelcomeMessages = () => {
        if (isFromKakao) {
            return {
                greeting: `${userName}, 환영합니다!`,
                subtitle: 'Momnect와 함께 특별한 순간들을 기록해보세요',
                description: '이제 우리 아이를 위한 쇼핑을 시작해보세요!'
            };
        }
        return {
            greeting: `${userName}, 환영합니다!`,
            subtitle: '이제 우리 서비스를 이용하실 수 있어요',
            description: '이제 우리 아이를 위한 쇼핑을 시작해보세요!'
        };
    };

    const messages = getWelcomeMessages();

    const handleLogin = () => {
        router.push('/login'); // 로그인 페이지로 이동
    };

    const handleGoToMain = () => {
        router.push('/'); // 메인 페이지로 이동
    };

    // 카카오 사용자용 서비스 시작하기
    const handleStartService = () => {
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

                    {/* 동적 환영 메시지 */}
                    <div className="welcome-message">
                        <p>{messages.greeting}</p>
                        <p>{messages.subtitle}</p>
                        <p>{messages.description}</p>
                    </div>

                    {/* 조건부 버튼 렌더링 */}
                    {isFromKakao ? (
                        // 카카오 로그인 사용자: 서비스 시작하기 버튼만
                        <>
                            <button className="login-button service-start" onClick={handleStartService}>
                                서비스 시작하기
                            </button>
                        </>
                    ) : (
                        // 일반 회원가입 사용자: 기존 버튼들 유지
                        <>
                            {/* 로그인 버튼 */}
                            <button className="login-button" onClick={handleLogin}>
                                로그인 하기
                            </button>

                            {/* 메인 페이지 링크 */}
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