// /utils/flattenCategoryNames.js

export function flattenCategoryNames(tree) {
  const result = [];

  function traverse(nodes) {
    for (const node of nodes) {
      result.push(node.name);
      if (node.children?.length > 0) traverse(node.children);
    }
  }

  traverse(tree);
  return result;
}
