class BaseError extends Error {
  constructor(name, httpCode, isOperational, description, code) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;
    this.code = code;

    Error.captureStackTrace(this);
  }
}

module.exports = BaseError;
