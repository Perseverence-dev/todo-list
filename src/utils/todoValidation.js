export const MAX_TODO_TITLE_LENGTH = 200;

// A title needs non-whitespace content and must stay within the length limit.
export function isValidTodoTitle(title) {
  const trimmed = title.trim();
  return trimmed !== '' && trimmed.length <= MAX_TODO_TITLE_LENGTH;
}