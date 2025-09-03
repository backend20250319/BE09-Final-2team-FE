// "YYYYMMDD" 형태의 문자열을 "YYYY년 MM월 DD일" 문자열로 변환
export function formatStringToDate(dateString) {
  if (!dateString || dateString.length !== 8) return "";

  const year = dateString.slice(0, 4);
  const month = dateString.slice(4, 6);
  const day = dateString.slice(6, 8);

  return `${year}년 ${month}월 ${day}일`;
}

// 사용 예시:
// const dateObj = formatStringToDate("20250801");
// console.log(dateObj); // Thu Aug 01 2025 ...

// Date 객체를 "YYYYMMDD" 문자열로 변환
export function formatDateToString(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  const dateString = `${year}${month}${day}`;
  return dateString;
}

// 사용 예시:
// const dateStr = formatDateToString(new Date());
// console.log(dateStr); // 20250801

// 숫자에 천 단위 콤마(,) 추가
export function numberWithCommas(number) {
  let buildNumber = typeof number === "string" ? number.replaceAll(",", "") : String(number);

  return buildNumber.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

// 사용 예시:
// const formatted = numberWithCommas(1234567);      // "1,234,567"
// const formattedStr = numberWithCommas("1234567"); // "1,234,567"


export function timeAgo(createdAt) {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now - created; // ms 차이
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30); // 단순화
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return `${diffSec}초 전`;
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  if (diffWeek < 5) return `${diffWeek}주 전`;
  if (diffMonth < 12) return `${diffMonth}개월 전`;
  return `${diffYear}년 전`;
}
