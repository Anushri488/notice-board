// Server-side validation for notice payloads.
// Runs inside the API routes — never trust the browser.

const CATEGORIES = ["Exam", "Event", "General"];
const PRIORITIES = ["Normal", "Urgent"];

/**
 * Validates a raw request body for creating/updating a notice.
 * Returns { valid: true, data } on success, or { valid: false, errors }
 * where errors is a map of field -> message.
 */
export function validateNoticeInput(body) {
  const errors = {};
  const data = {};

  // --- title ---
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) {
    errors.title = "Title is required.";
  } else if (title.length > 200) {
    errors.title = "Title must be 200 characters or fewer.";
  } else {
    data.title = title;
  }

  // --- body ---
  const noticeBody = typeof body.body === "string" ? body.body.trim() : "";
  if (!noticeBody) {
    errors.body = "Body is required.";
  } else {
    data.body = noticeBody;
  }

  // --- category ---
  const category = body.category;
  if (!CATEGORIES.includes(category)) {
    errors.category = `Category must be one of: ${CATEGORIES.join(", ")}.`;
  } else {
    data.category = category;
  }

  // --- priority ---
  const priority = body.priority;
  if (!PRIORITIES.includes(priority)) {
    errors.priority = `Priority must be one of: ${PRIORITIES.join(", ")}.`;
  } else {
    data.priority = priority;
  }

  // --- publishDate ---
  const rawDate = body.publishDate;
  const parsedDate = rawDate ? new Date(rawDate) : null;
  if (!rawDate || !parsedDate || Number.isNaN(parsedDate.getTime())) {
    errors.publishDate = "A valid publish date is required.";
  } else {
    data.publishDate = parsedDate;
  }

  return Object.keys(errors).length > 0
    ? { valid: false, errors }
    : { valid: true, data };
}
