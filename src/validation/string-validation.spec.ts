import { isStringFalsey, isStringTruthy } from './string-validation';

it('Should validate when a string is falsey when it is.', () => {
  expect(isStringFalsey('')).toBe(true);
  expect(isStringFalsey('      ')).toBe(true);
  expect(isStringFalsey(null as any)).toBe(true);
  expect(isStringFalsey(undefined as any)).toBe(true);
});

it('Should validate when a string is not falsey when it is not.', () => {
  expect(isStringFalsey('test')).toBe(false);
});

it('Should validate when a string is not truthy when it is not.', () => {
  expect(isStringTruthy('')).toBe(false);
  expect(isStringTruthy('      ')).toBe(false);
  expect(isStringTruthy(null as any)).toBe(false);
  expect(isStringTruthy(undefined as any)).toBe(false);
});

it('Should validate when a string is truthy when it is.', () => {
  expect(isStringTruthy('test')).toBe(true);
});
