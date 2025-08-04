export const mockCategoryData = [
  // 상위 카테고리 (column 정보 포함)
  { id: 1, group_id: 5, parent_id: null, code_value: "출산/육아용품", sort_order: 1, column: 1 },
  { id: 2, group_id: 5, parent_id: null, code_value: "유아동안전/실내용품", sort_order: 2, column: 1 },
  { id: 3, group_id: 5, parent_id: null, code_value: "유아동의류", sort_order: 3, column: 2 },
  { id: 4, group_id: 5, parent_id: null, code_value: "유아동잡화", sort_order: 4, column: 2 },
  { id: 5, group_id: 5, parent_id: null, code_value: "유아동가구", sort_order: 5, column: 2 },
  { id: 6, group_id: 5, parent_id: null, code_value: "유아동교구/완구", sort_order: 6, column: 3 },
  { id: 7, group_id: 5, parent_id: null, code_value: "기타 유아동용품", sort_order: 7, column: 3 },

  // 하위 카테고리 (각 상위 카테고리의 parent_id 참조)
  // 출산/육아용품
  { id: 101, group_id: 5, parent_id: 1, code_value: "모유수유용품", sort_order: 1 },
  { id: 102, group_id: 5, parent_id: 1, code_value: "분유수유용품", sort_order: 2 },
  { id: 103, group_id: 5, parent_id: 1, code_value: "튼살크림/스킨케어", sort_order: 3 },
  { id: 104, group_id: 5, parent_id: 1, code_value: "임부복/수유복/언더웨어", sort_order: 4 },
  { id: 105, group_id: 5, parent_id: 1, code_value: "물티슈/기저귀", sort_order: 5 },
  { id: 106, group_id: 5, parent_id: 1, code_value: "분유/이유식", sort_order: 6 },
  { id: 107, group_id: 5, parent_id: 1, code_value: "아기띠/기저귀가방", sort_order: 7 },
  { id: 108, group_id: 5, parent_id: 1, code_value: "신생아/영유아의류", sort_order: 8 },
  { id: 109, group_id: 5, parent_id: 1, code_value: "유아로션/목욕용품", sort_order: 9 },
  { id: 110, group_id: 5, parent_id: 1, code_value: "유아건강/위생용품", sort_order: 10 },
  { id: 111, group_id: 5, parent_id: 1, code_value: "유모차/웨건", sort_order: 11 },

  // 유아동안전/실내용품
  { id: 121, group_id: 5, parent_id: 2, code_value: "카시트", sort_order: 1 },
  { id: 122, group_id: 5, parent_id: 2, code_value: "놀이매트", sort_order: 2 },
  { id: 123, group_id: 5, parent_id: 2, code_value: "보행기/쏘서/바운서/부스터", sort_order: 3 },

  // 유아동의류
  { id: 131, group_id: 5, parent_id: 3, code_value: "유아용의류", sort_order: 1 },
  { id: 132, group_id: 5, parent_id: 3, code_value: "아동용의류", sort_order: 2 },
  { id: 133, group_id: 5, parent_id: 3, code_value: "내의/잠옷/속옷", sort_order: 3 },
  { id: 134, group_id: 5, parent_id: 3, code_value: "패딩/자켓", sort_order: 4 },
  { id: 135, group_id: 5, parent_id: 3, code_value: "한복/소품", sort_order: 5 },

  // 유아동잡화
  { id: 141, group_id: 5, parent_id: 4, code_value: "구두/운동화/샌들/부츠", sort_order: 1 },
  { id: 142, group_id: 5, parent_id: 4, code_value: "장화/우비/우산", sort_order: 2 },
  { id: 143, group_id: 5, parent_id: 4, code_value: "모자/장갑", sort_order: 3 },
  { id: 144, group_id: 5, parent_id: 4, code_value: "책가방/여행가방", sort_order: 4 },

  // 유아동가구
  { id: 151, group_id: 5, parent_id: 5, code_value: "침대/매트리스", sort_order: 1 },
  { id: 152, group_id: 5, parent_id: 5, code_value: "옷장/서랍장", sort_order: 2 },
  { id: 153, group_id: 5, parent_id: 5, code_value: "책상/공부상/책장", sort_order: 3 },
  { id: 154, group_id: 5, parent_id: 5, code_value: "의자/소파/빈백", sort_order: 4 },

  // 유아동교구/완구
  { id: 161, group_id: 5, parent_id: 6, code_value: "신생아완구", sort_order: 1 },
  { id: 162, group_id: 5, parent_id: 6, code_value: "원목교구", sort_order: 2 },
  { id: 163, group_id: 5, parent_id: 6, code_value: "음악놀이/자석교구", sort_order: 3 },
  { id: 164, group_id: 5, parent_id: 6, code_value: "전동차/핫휠", sort_order: 4 },
  { id: 165, group_id: 5, parent_id: 6, code_value: "로봇", sort_order: 5 },
  { id: 166, group_id: 5, parent_id: 6, code_value: "인형/디즈니의상", sort_order: 6 },
  { id: 167, group_id: 5, parent_id: 6, code_value: "블록/레고", sort_order: 7 },
  { id: 168, group_id: 5, parent_id: 6, code_value: "대형 완구용품", sort_order: 8 },
];
