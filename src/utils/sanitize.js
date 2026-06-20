import DOMPurify from 'dompurify';

// Strips all HTML from a string, returning plain text.
export function sanitizeText(input) {
  return DOMPurify.sanitize(String(input), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}
