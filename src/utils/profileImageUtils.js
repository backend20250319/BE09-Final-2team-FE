/**
 * 4가지 색깔의 기본 프로필 이미지
 */
const DEFAULT_PROFILE_IMAGES = [
    '/images/common/default-profile-1.png',
    '/images/common/default-profile-2.png',
    '/images/common/default-profile-3.png',
    '/images/common/default-profile-4.png'
];

/**
 * userId를 기반으로 일관된 기본 프로필 이미지 선택
 */
export const getDefaultProfileImage = (userId) => {
    if (!userId) return DEFAULT_PROFILE_IMAGES[0];
    const index = userId % DEFAULT_PROFILE_IMAGES.length;
    return DEFAULT_PROFILE_IMAGES[index];
};

/**
 * 프로필 이미지 URL 반환
 */
export const getProfileImageUrl = (profileImageUrl, userId) => {
    return profileImageUrl || getDefaultProfileImage(userId);
};

/**
 * 모든 기본 프로필 이미지 목록 반환
 */
export const getAllDefaultProfileImages = () => {
    return [...DEFAULT_PROFILE_IMAGES];
};