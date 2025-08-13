'use client';
import React, { useState, useEffect } from 'react';
import '../css/MyReviewEditForm.css';
import ConfirmModal, { MODAL_TYPES } from '@/components/common/ConfirmModal';

const MyReviewEditForm = ({ onClose }) => {
    const [rating, setRating] = useState(3);
    const [answers, setAnswers] = useState({
        kind: true,
        promise: true,
        satisfaction: true,
    });
    const [reviewText, setReviewText] = useState('안녕하세요');

    const [animateClass, setAnimateClass] = useState('animate-slide-in');

    const [modalOpen, setModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        title: '',
        message: '',
        type: MODAL_TYPES.CONFIRM_CANCEL,
        confirmText: '확인',
        cancelText: '취소',
        onConfirm: () => {},
    });

    const toggleAnswer = (key, value) => {
        setAnswers(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
        setModalConfig({
            title: '리뷰 수정',
            message: '리뷰를 수정하시겠습니까?',
            type: MODAL_TYPES.CONFIRM_CANCEL,
            confirmText: '수정',
            cancelText: '취소',
            onConfirm: () => {
                setModalOpen(false);
                setTimeout(() => {
                    setModalConfig({
                        title: '수정 완료',
                        message: '리뷰가 성공적으로 수정되었습니다.',
                        type: MODAL_TYPES.CONFIRM_ONLY,
                        confirmText: '확인',
                        onConfirm: () => {
                            setModalOpen(false);
                            handleClose();
                        },
                    });
                    setModalOpen(true);
                }, 500);
            },
        });
        setModalOpen(true);
    };

    const handleClose = () => {
        setAnimateClass('animate-slide-out');
        setTimeout(() => {
            onClose();
        }, 300);
    };

    return (
        <>
            <aside className={`review-edit-sidebar ${animateClass}`}>
                <div className="sidebar-header">
                    <button className="back-button" onClick={handleClose}>
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="black"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                    <h1 className="sidebar-title">OO님과의 거래 리뷰</h1>
                </div>

                <div className="review-edit-content">
                    <p className="section-title">별점을 선택해주세요.</p>
                    <div className="star-container">
                        {[1, 2, 3, 4, 5].map((num) => {
                            const isFull = rating >= num;
                            const isHalf = rating >= num - 0.5 && rating < num;

                            return (
                                <span
                                    key={num}
                                    className="star-wrapper"
                                    onClick={(e) => {
                                        const rect = e.target.getBoundingClientRect();
                                        const clickX = e.clientX - rect.left;
                                        const clickedHalf = clickX < rect.width / 2;
                                        setRating(clickedHalf ? num - 0.5 : num);
                                    }}
                                >
                                    <span className="star-background">★</span>
                                    {isFull ? (
                                        <span className="star-foreground full">★</span>
                                    ) : isHalf ? (
                                        <span className="star-foreground half">★</span>
                                    ) : null}
                                </span>
                            );
                        })}
                    </div>

                    <div className="question-section">
                        <p className="section-title">상대방이 친절했나요?</p>
                        <div className="option-container">
                            <button className={`option-button ${answers.kind ? 'active' : ''}`} onClick={() => toggleAnswer('kind', true)}>❤️ 친절했어요.</button>
                            <button className={`option-button ${!answers.kind ? 'active' : ''}`} onClick={() => toggleAnswer('kind', false)}>🤍 별로였어요.</button>
                        </div>

                        <p className="section-title">약속은 잘 지켰나요?</p>
                        <div className="option-container">
                            <button className={`option-button ${answers.promise ? 'active' : ''}`} onClick={() => toggleAnswer('promise', true)}>❤️ 잘 지켰어요.</button>
                            <button className={`option-button ${!answers.promise ? 'active' : ''}`} onClick={() => toggleAnswer('promise', false)}>🤍 잘 안지켰어요.</button>
                        </div>

                        <p className="section-title">상품은 만족하나요?</p>
                        <div className="option-container">
                            <button className={`option-button ${answers.satisfaction ? 'active' : ''}`} onClick={() => toggleAnswer('satisfaction', true)}>❤️ 만족합니다.</button>
                            <button className={`option-button ${!answers.satisfaction ? 'active' : ''}`} onClick={() => toggleAnswer('satisfaction', false)}>🤍 별로였어요.</button>
                        </div>
                    </div>

                    <div className="review-detail-section">
                        <p className="section-title">상세 리뷰 작성</p>
                        <div className="text-area-container">
                            <textarea
                                className="review-textarea"
                                placeholder="리뷰를 입력하세요"
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                maxLength={1000}
                            />
                            <div className="character-count">{reviewText.length}/1000</div>
                        </div>
                    </div>

                    <div className="submit-container">
                        <button className="submit-button" onClick={handleSubmit}>수정</button>
                    </div>
                </div>
            </aside>

            <ConfirmModal
                open={modalOpen}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
                confirmText={modalConfig.confirmText}
                cancelText={modalConfig.cancelText}
                onConfirm={modalConfig.onConfirm}
                onCancel={() => {
                    setModalOpen(false);
                    handleClose();
                }}
            />
        </>
    );
};
export default MyReviewEditForm;
