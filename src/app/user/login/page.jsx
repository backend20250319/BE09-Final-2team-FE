import React from 'react';
import './Login.css';
//import mainImage from './images/main-image.png';

export default function Login() {
    return (
        <div className="login-root">
            <div className="login-card">
                <img src="/header/header-logo.png" alt="main visual" className="login-main-image" />
                <form className="login-form">
                    <input
                        className="login-input"
                        type="text"
                        placeholder="아이디를 입력해 주세요."
                        required
                    />
                    <input
                        className="login-input"
                        type="password"
                        placeholder="비밀번호를 입력해 주세요."
                        required
                    />
                    <button className="login-btn" type="submit">
                        로그인
                    </button>
                    <div className="login-sns">
                        <button className="sns-btn kakao">카카오 아이디로 로그인</button>
                    </div>
                </form>
                <div className="login-links">
                    <a href="#" className="signup-link">계정이 없으신가요? 회원가입</a>
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