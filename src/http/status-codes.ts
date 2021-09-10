export function isSuccessCode(code: number): boolean {
  return String(code).startsWith('2');
}
