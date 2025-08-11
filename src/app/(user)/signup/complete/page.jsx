"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './signup-complete.css';

const SignupComplete = () => {
    const router = useRouter();
    const [userName] = useState('만두님'); // 나중에 실제 사용자 이름으로 변경 가능

    const handleLogin = () => {
        router.push('/login'); // 로그인 페이지로 이동
    };

    const handleGoToMain = () => {
        router.push('/'); // 메인 페이지로 이동
    };

    return (
        <div className="signup-complete-container">
            <div className="signup-complete-card">
                <div className="card-content">
                    {/* 이미지 */}
                    <div className="image-container">
                        <img
                            src="/images/common/main-logo.png"
                            alt="Momnect 로고"
                            className="completion-image"
                        />
                    </div>

                    {/* 환영 메시지 */}
                    <div className="welcome-message">
                        <p>만두님, 환영합니다!</p>
                        <p>이제 우리 서비스를 이용하실 수 있어요</p>
                        <p>이제 우리 아이를 위한 쇼핑을 시작해보세요!</p>
                    </div>

                    {/* 로그인 버튼 */}
                    <button className="login-button" onClick={handleLogin}>
                        로그인 하기
                    </button>

                    {/* 메인 페이지 링크 */}
                    <button className="main-page-link" onClick={handleGoToMain}>
                        메인 페이지로 가기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignupComplete;
