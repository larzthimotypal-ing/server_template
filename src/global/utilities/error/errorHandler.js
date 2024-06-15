import BaseError from "./baseError";

class ErrorHandler {
  async handleError(error) {
    await logger.error("error", error.name, error);
  }

  isTrustedError(error) {
    if (error instanceof BaseError) {
      return error.isOperational;
    }
    return false;
  }
}

const errorHandler = new ErrorHandler();

export default errorHandler;
