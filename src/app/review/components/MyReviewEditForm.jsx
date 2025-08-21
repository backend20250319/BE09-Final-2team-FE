'use client';
import React, { useState } from 'react';
import '../css/MyReviewEditForm.css';
import ConfirmModal, { MODAL_TYPES } from '@/components/common/ConfirmModal';

const MyReviewEditForm = ({ onClose, initialRating, initialAnswers, initialReviewText, onSave, reviewId }) => {
    const [rating, setRating] = useState(initialRating || 3);
    const [answers, setAnswers] = useState(initialAnswers || {
        kind: true,
        promise: true,
        satisfaction: true,
    });
    const [reviewText, setReviewText] = useState(initialReviewText || '');

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

    const handleClose = () => {
        setAnimateClass('animate-slide-out');
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const showModal = (config) => {
        setModalConfig(config);
        setModalOpen(true);
    };

    const handleSubmit = async () => {
        if (reviewText.length < 20) {
            showModal({
                title: '알림',
                message: '리뷰 내용을 20자 이상 입력해주세요.',
                type: MODAL_TYPES.CONFIRM_ONLY,
                confirmText: '확인',
                onConfirm: () => setModalOpen(false),
            });
            return;
        }

        showModal({
            title: '리뷰 수정',
            message: '리뷰를 수정하시겠습니까?',
            type: MODAL_TYPES.CONFIRM_CANCEL,
            confirmText: '수정',
            cancelText: '취소',
            onConfirm: async () => {
                const updatedReviewData = {
                    rating: rating,
                    content: reviewText,
                    kind: answers.kind,
                    promise: answers.promise,
                    satisfaction: answers.satisfaction,
                };

                try {
                    const response = await fetch(`http://localhost:8000/api/v1/review-service/reviews/${reviewId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedReviewData),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || '리뷰 수정에 실패했습니다.');
                    }

                    onSave && onSave({
                        rating,
                        answers,
                        reviewText
                    });

                    showModal({
                        title: '수정 완료',
                        message: '리뷰가 성공적으로 수정되었습니다.',
                        type: MODAL_TYPES.CONFIRM_ONLY,
                        confirmText: '확인',
                        onConfirm: () => {
                            setModalOpen(false);
                            handleClose();
                        },
                    });

                } catch (error) {
                    console.error("Error updating review:", error);
                    showModal({
                        title: '오류',
                        message: `리뷰 수정 중 오류가 발생했습니다: ${error.message}`,
                        type: MODAL_TYPES.CONFIRM_ONLY,
                        confirmText: '확인',
                        onConfirm: () => setModalOpen(false),
                    });
                }
            },
            onCancel: () => {
                setModalOpen(false);
                handleClose();
            },
        });
    };

    return (
        <>
            <aside className={`review-edit-sidebar ${animateClass}`}>
                <div className="sidebar-header">
                    <button className="back-button" onClick={handleClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24"
                             fill="none" stroke="black" strokeWidth="2"
                             strokeLinecap="round" strokeLinejoin="round">
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
                                minLength={20}
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
                onCancel={modalConfig.onCancel}
            />
        </>
    );
};

export default MyReviewEditForm;