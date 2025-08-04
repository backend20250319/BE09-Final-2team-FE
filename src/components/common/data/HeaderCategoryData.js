// 실제 DB 응답을 시뮬레이션한 더미 데이터
// group_id: 공통코드 그룹 (PRODUCT_CATEGORY)
// parent_id: null = 상위 카테고리
// column: 프론트에서 열(컬럼)로 나누기 위한 정보

export const mockCategoryData = [
  // 상위 카테고리 (column 정보 포함)
  { id: 1, group_id: 5, parent_id: null, code_value: "출산/육아용품", sort_order: 1, column: 1 },
  { id: 2, group_id: 5, parent_id: null, code_value: "유아동의류", sort_order: 2, column: 2 },
  { id: 3, group_id: 5, parent_id: null, code_value: "유아동잡화", sort_order: 3, column: 2 },
  { id: 4, group_id: 5, parent_id: null, code_value: "유아동교구/완구", sort_order: 4, column: 3 },
  { id: 5, group_id: 5, parent_id: null, code_value: "기타 유아동 물품", sort_order: 5, column: 3 },

  // 하위 카테고리 (각 상위 카테고리의 parent_id 참조)
  { id: 6, group_id: 5, parent_id: 1, code_value: "분유/이유식", sort_order: 1 },
  { id: 7, group_id: 5, parent_id: 1, code_value: "물티슈/기저귀", sort_order: 2 },
  { id: 8, group_id: 5, parent_id: 2, code_value: "유아상의", sort_order: 1 },
  { id: 9, group_id: 5, parent_id: 2, code_value: "유아하의", sort_order: 2 },
  { id: 10, group_id: 5, parent_id: 3, code_value: "모자/장갑", sort_order: 1 },
  { id: 11, group_id: 5, parent_id: 4, code_value: "원목교구", sort_order: 1 },
];
