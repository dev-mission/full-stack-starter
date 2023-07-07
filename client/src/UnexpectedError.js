class UnexpectedError extends Error {
  constructor() {
    super('An unexpected error has occurred. Please try again.');
  }
}

export default UnexpectedError;
