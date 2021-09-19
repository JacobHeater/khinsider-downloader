/**
 * Checks if a string is a falsey value or not.
 *
 * @param string The string to validate.
 * @returns A boolean indicating falsey status.
 */
export function isStringFalsey(string: string): boolean {
  return !(string || '').trim();
}

/**
 * Checks if a string is a truthy value or not.
 *
 * @param string The string to validate.
 * @returns A boolean indicating truthy status.
 */
export function isStringTruthy(string: string): boolean {
  return !!(string || '').trim();
}
