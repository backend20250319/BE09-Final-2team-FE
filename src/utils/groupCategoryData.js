export function groupCategoryWithColumn(data) {
  // 상위/하위 분리
  const parents = data.filter((d) => d.parent_id === null);
  const children = data.filter((d) => d.parent_id !== null);

  const columnMap = {};

  parents.forEach((parent) => {
    const col = parent.column || 1;
    if (!columnMap[col]) columnMap[col] = [];

    // 하위 카테고리 정렬 및 전체 객체 유지
    const childItems = children
      .filter((child) => child.parent_id === parent.id)
      .sort((a, b) => a.sort_order - b.sort_order);

    columnMap[col].push({
      title: parent.code_value,
      href: parent.href || "#",
      items: childItems.map((child) => ({
        name: child.code_value,
        href: child.href || "#",
      })),
    });
  });

  return columnMap;
}
