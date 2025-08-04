// 이 함수는 공통코드 데이터를 받아서
// column 번호 기준으로 정리된 카테고리 구조를 반환합니다.

export function groupCategoryWithColumn(data) {
  // 상위 카테고리 추출 (parent_id가 null)
  const parents = data.filter((d) => d.parent_id === null);

  // 하위 카테고리 추출
  const children = data.filter((d) => d.parent_id !== null);

  // 컬럼별 정리된 카테고리 구조 저장
  const columnMap = {};

  // 각 상위 카테고리를 컬럼번호 기준으로 분류
  parents.forEach((parent) => {
    const col = parent.column || 1; // column 값이 없으면 기본값 1 사용
    if (!columnMap[col]) columnMap[col] = [];

    // 해당 상위 카테고리에 포함되는 하위 카테고리 정렬
    const childItems = children
      .filter((child) => child.parent_id === parent.id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((child) => child.code_value); // 하위 이름만 추출

    // 최종 컬럼별 그룹 데이터 저장
    columnMap[col].push({
      title: parent.code_value,
      items: childItems,
    });
  });

  return columnMap;
}
