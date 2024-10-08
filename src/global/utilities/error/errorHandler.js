const APIError = require("./apiError.js");
const BaseError = require("./baseError.js");

class ErrorHandler {
  async handleError(error) {
    await logger.error("error", error.name, error);
  }

  isTrustedError(error) {
    if (
      error instanceof BaseError ||
      error instanceof APIError ||
      error instanceof Error
    ) {
      return error.isOperational;
    }
    return false;
  }
}

const errorHandler = new ErrorHandler();

module.exports = errorHandler;
