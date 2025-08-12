"use client";

import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/navigation'; //라우터 추가
import Link from 'next/link';
import './login.css';

export default function Login() {
    const router = useRouter(); //라우터 선언

    // 1. 상태변수 정의
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    // 2. userId와 password 가 변경될 때마다 실행될 함수
    useEffect(() => {
        // userId와 password 가 모두 비어있지 않으면 버튼 활성화
        if (userId.trim() !== '' && password.trim() !== '') {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [userId, password]); // userId와 password 가 변경될 때마다 useEffect 실행

    // 3. 폼 제출 시 실행될 함수
    const handleSubmit = (event) => {
        event.preventDefault(); // 기본 폼 제출 동작 방지

        if (isButtonDisabled) {
            // button 의 disabled 때문에 실행되지 않지만 만약에 대비해 유효성 검사 메세지 띄우기
            alert("아이디와 비밀번호를 모두 입력해주세요");
            return;
        }
        // todo : 여기서 로그인 api를 호출하는 로직 작성
        console.log("로그인 시도:", {userId, password});

        // 일반 로그인 성공 시 메인 페이지로 이동
        // 실제로는 API 호출 후 성공하면 이동
        // router.push('/');
    };

    // 카카오 로그인 핸들러 추가
    const handleKakaoLogin = () => {
        // 현재는 API 연동 없이 바로 추가정보 입력 페이지로 이동
        // 실제 카카오 로그인 API는 백엔드 연동 후 구현 예정
        router.push('/additional-info');
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
                        onChange={(e) => setUserId(e.target.value)}
                        required
                    />
                    <input
                        className="login-input"
                        type="password"
                        placeholder="비밀번호를 입력해 주세요."
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}
                        required
                    />
                    <button className="login-btn" type="submit" disabled={isButtonDisabled}>
                        {/* 상태에 따라 disabled 속성 변경 */}
                        로그인
                    </button>
                    <div className="login-sns">
                        {/* 카카오 버튼에 onClick 핸들러 추가 */}
                        <button
                            className="sns-btn kakao"
                            type="button"
                            onClick={handleKakaoLogin}
                        >
                            카카오 아이디로 로그인
                        </button>
                    </div>
                </form>
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