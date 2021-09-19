export enum ArgumentInvalidReason {
  InvalidFormat,
  Null,
  Unknown,
}

export class ArgumentInvalidError extends Error {
  constructor(argumentName: string, reason: ArgumentInvalidReason) {
    let message: string = '';

    switch (reason) {
      case ArgumentInvalidReason.InvalidFormat:
        message = `Argument "${argumentName}" was given in an invalid format.`;
        break;
      case ArgumentInvalidReason.Null:
        message = `Argument "${argumentName}" was null or falsey, but was expected not to be.`;
        break;
      case ArgumentInvalidReason.Unknown:
      default:
        message = `Argument "${argumentName}" failed for an unkown reason.`;
        break;
    }

    super(message);

    // Weird issue with TS where Jest does not get the correct prototype
    // from inheritance.
    // See: https://github.com/facebook/jest/issues/8279#issuecomment-539775425
    Object.setPrototypeOf(this, ArgumentInvalidError.prototype);
  }
}
