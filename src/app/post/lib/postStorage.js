const KEYS = {
  tips: "posts:tips",
  groupbuy: "posts:groupbuy",
};

export function formatDate(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

export function loadPosts(type) {
  if (typeof window === "undefined") return [];
  const key = type === "groupbuy" ? KEYS.groupbuy : KEYS.tips;
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

export function savePost(post) {
  if (typeof window === "undefined") return;
  const type = post.category === "공동구매" ? "groupbuy" : "tips";
  const key = type === "groupbuy" ? KEYS.groupbuy : KEYS.tips;
  const list = loadPosts(type);
  list.unshift(post);
  localStorage.setItem(key, JSON.stringify(list));
}

export function removePost(type, id) {
  if (typeof window === "undefined") return;
  const key = type === "groupbuy" ? KEYS.groupbuy : KEYS.tips;
  const list = loadPosts(type).filter((p) => p.id !== id);
  localStorage.setItem(key, JSON.stringify(list));
}

export function clearPosts(type) {
  if (typeof window === "undefined") return;
  const key = type === "groupbuy" ? KEYS.groupbuy : KEYS.tips;
  localStorage.removeItem(key);
}

export function clearAll() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEYS.tips);
  localStorage.removeItem(KEYS.groupbuy);
}
