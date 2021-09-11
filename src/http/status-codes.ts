/**
 * Checks if the given status code is a success status code.
 *
 * @param code The status code to check.
 * @returns
 */
export function isSuccessCode(code: number): boolean {
  if (isNaN(code)) {
    return false;
  }

  return String(code).startsWith('2');
}
