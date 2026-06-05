/**
 * Basic HTML sanitizer — strips all HTML tags from a string.
 * Use this for user-generated content like notes.
 */
export function stripHtml(str) {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '').trim();
}

/**
 * Truncate a string to maxLen characters.
 */
export function truncate(str, maxLen = 500) {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen) + '...' : str;
}
