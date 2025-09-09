'use client';

import React, { useState } from 'react';
import '../css/MyReviewEditForm.css';
import ConfirmModal, { MODAL_TYPES } from '@/components/common/ConfirmModal';
import { reviewAPI } from '@/lib/api';

const MyReviewEditForm = ({ onClose, initialRating, initialAnswers, initialReviewText, onSave, reviewId, user, review }) => {
    const [rating, setRating] = useState(initialRating || 3);
    const [answers, setAnswers] = useState(initialAnswers || {
        kind: true,
        promise: true,
        satisfaction: true,
    });
    const [reviewText, setReviewText] = useState(initialReviewText || '');

    const [animateClass, setAnimateClass] = useState('animate-slide-in');
    const [modalOpen, setModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
    const [modalConfig, setModalConfig] = useState({
        title: '',
        message: '',
        type: MODAL_TYPES.CONFIRM_CANCEL,
        confirmText: '확인',
        cancelText: '취소',
        onConfirm: () => {},
        onCancel: () => {},
    });

    // 상대방의 이름을 추출하는 함수
    const getTargetUserName = () => {
        if (!review) return '상대방';

        console.log('리뷰 데이터:', review); // 리뷰 데이터 확인
        console.log('현재 유저:', user); // 현재 유저 정보 확인

        // 리뷰 데이터에서 상대방 정보 추출
        // 일반적으로 리뷰에는 sellerId, buyerId, targetUserId 등의 필드가 있음
        // 현재 로그인한 유저와 다른 ID를 가진 유저가 상대방

        if (review.sellerName && review.sellerName !== nickname?.name) {
            return review.sellerName;
        }

        if (review.buyerName && review.buyerName !== nickname?.name) {
            return review.buyerName;
        }

        if (review.targetUserName) {
            return review.targetUserName;
        }

        // 상대방 정보가 없는 경우 기본값
        return '상대방';
    };

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

        if (reviewText.length > 1000) {
            showModal({
                title: '알림',
                message: '리뷰 내용은 1000자를 초과할 수 없습니다.',
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
                // 모달을 닫는 대신, 로딩 상태로 즉시 변경
                setModalConfig({
                    title: '수정 중',
                    message: '리뷰를 수정하는 중입니다...',
                    type: MODAL_TYPES.CONFIRM_ONLY,
                    confirmText: null,
                    cancelText: null,
                    onConfirm: null, // 로딩 중에는 확인 버튼 동작 없음
                    onCancel: null,
                });
                setModalOpen(true);
                setIsLoading(true);

                const updatedReviewData = {
                    rating: rating,
                    content: reviewText,
                    kind: answers.kind,
                    promise: answers.promise,
                    satisfaction: answers.satisfaction,
                };

                try {
                    // 존재 여부 사전 확인
                    try {
                        await reviewAPI.getReviewById(reviewId);
                    } catch (existErr) {
                        const msg = existErr.response?.data?.message || '리뷰가 존재하지 않거나 삭제되었습니다.';
                        setModalConfig({
                            title: '오류',
                            message: msg,
                            type: MODAL_TYPES.CONFIRM_ONLY,
                            confirmText: '확인',
                            onConfirm: () => setModalOpen(false),
                            onCancel: null,
                        });
                        return;
                    }

                    const response = await reviewAPI.updateReview(
                        reviewId,
                        updatedReviewData,
                        user?.id ?? review?.userId,
                        review?.productId
                    );

                    if (response.status !== 200) {
                        throw new Error('리뷰 수정에 실패했습니다.');
                    }

                    onSave && onSave({
                        rating,
                        answers,
                        reviewText
                    });

                    // 성공 시 완료 모달로 내용 변경
                    setModalConfig({
                        title: '수정 완료',
                        message: '리뷰가 성공적으로 수정되었습니다.',
                        type: MODAL_TYPES.CONFIRM_ONLY,
                        confirmText: '확인',
                        onConfirm: () => {
                            setModalOpen(false); // 최종 모달 닫기
                            handleClose(); // 사이드바 애니메이션 시작
                        },
                        onCancel: null,
                    });

                } catch (error) {
                    console.error("Error updating review:", error);
                    // 실패 시 오류 모달로 내용 변경
                    setModalConfig({
                        title: '오류',
                        message: `리뷰 수정 중 오류가 발생했습니다: ${error.message}`,
                        type: MODAL_TYPES.CONFIRM_ONLY,
                        confirmText: '확인',
                        onConfirm: () => setModalOpen(false),
                        onCancel: null,
                    });
                } finally {
                    setIsLoading(false);
                }
            },
            onCancel: () => {
                setModalOpen(false);
                handleClose();
            },
        });
    };

    const handleOutsideClick = (e) => {
        if (modalOpen || isLoading) {
            return;
        }
        if (e.target.classList.contains('review-edit-backdrop')) {
            handleClose();
        }
    };

    return (
        <div className="review-edit-backdrop" onClick={handleOutsideClick}>
            <aside className={`review-edit-sidebar ${animateClass}`}>
                <div className="sidebar-header">
                    <button
                        className="back-button"
                        onClick={handleClose}
                        disabled={modalOpen || isLoading}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24"
                             fill="none" stroke="black" strokeWidth="2"
                             strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                    <h1 className="sidebar-title">"{getTargetUserName()}"님과의 거래 리뷰</h1>
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
                                // minLength={20}
                            />
                            <div className="character-count">{reviewText.length}/1000</div>
                        </div>
                    </div>

                    <div className="submit-container">
                        <button className="submit-button" onClick={handleSubmit}>수정</button>
                    </div>
                </div>
            </aside>

            {/* 로딩 모달과 최종 모달을 하나의 ConfirmModal 컴포넌트로 관리 */}
            {modalOpen && (
                (modalConfig.title === '수정 중' ? (
                    <div className="custom-loading-modal">
                        <div className="modal-content">
                            <h2>{modalConfig.title}</h2>
                            <p>{modalConfig.message}</p>
                            <div className="spinner"></div> {/* 스피너 추가 */}
                        </div>
                    </div>
                ) : (
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
                ))
            )}

        </div>
    );
};

export default MyReviewEditForm;
