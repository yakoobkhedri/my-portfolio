export const toSlug = (title) => {
  if (!title) return "";
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]/g, ""); // ← حروف فارسی و انگلیسی رو نگه دار
};