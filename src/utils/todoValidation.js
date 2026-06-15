/**
 * Checks whether a todo title has real content.
 * Empty strings and whitespace-only strings are invalid.
 */
export function isValidTodoTitle(title) {
  return title.trim() !== '';
}