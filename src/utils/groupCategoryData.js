// utils/groupCategoryData.js
export function groupCategoryWithColumn(categories, columnCount = 3) {
    if (!Array.isArray(categories) || categories.length === 0) return {};

    // 각 상위 카테고리의 총 아이템 수 = 자기 자신 + children.length
    const weightedCategories = categories.map((cat) => ({
        ...cat,
        weight: 1 + (cat.children?.length || 0),
    }));

    // 전체 weight 합
    const totalWeight = weightedCategories.reduce((sum, c) => sum + c.weight, 0);
    const targetPerCol = Math.ceil(totalWeight / columnCount);

    // 열별로 균등하게 배분
    const grouped = {};
    let currentCol = 0;
    let currentWeight = 0;
    grouped[currentCol] = [];

    for (const cat of weightedCategories) {
        if (currentWeight + cat.weight > targetPerCol && currentCol < columnCount - 1) {
            // 다음 열로 이동
            currentCol++;
            grouped[currentCol] = [];
            currentWeight = 0;
        }

        grouped[currentCol].push(cat);
        currentWeight += cat.weight;
    }

    return grouped;
}
