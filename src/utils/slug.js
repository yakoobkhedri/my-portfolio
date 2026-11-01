export const toSlug = (title) => {
  if (!title) return ""; // اگه title خالی بود، رشته خالی برگردون
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};