import { isSuccessCode } from './status-codes';

it('Should determine when a success code is successful.', () => {
  const successCodes = [200, 201, 202, 203, 204];

  successCodes.forEach((code) => expect(isSuccessCode(code)).toBe(true));
});

it('Should determine when a failure code is unsuccessful', () => {
  const failureCodes = [500, 404, 400, 401];

  failureCodes.forEach((code) => expect(isSuccessCode(code)).toBe(false));
});

it('Should return false for cases where the input is not a number.', () => {
  expect(isSuccessCode(NaN)).toBe(false);
});

it('Should reutrn false when the input cannot be coerced into a number.', () => {
  expect(isSuccessCode(undefined as any)).toBe(false);
  expect(isSuccessCode(null as any)).toBe(false);
  expect(isSuccessCode('test' as any)).toBe(false);
  expect(isSuccessCode('' as any)).toBe(false);
});
