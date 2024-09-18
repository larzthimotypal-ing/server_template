const HttpStatusCodes = require("./../../constants/httpStatusCodes.const.js");
const BaseError = require("./baseError.js");
const ResponseCodes = require("../../constants/responseCodes.const.js");

class APIError extends BaseError {
  constructor(
    name,
    httpCode = HttpStatusCodes.INTERNAL_SERVER,
    isOperational = true,
    description = "internal server error",
    code = ResponseCodes.GEN__SERVER_ERROR
  ) {
    super(name, httpCode, isOperational, description, code);
  }
}

module.exports = APIError;

// function newAPIError(name, httpCode, isOperational, desc) {
//   const newError = new APIError(name, httpCode, isOperational, desc);
//   return newError;
// }

// export default newAPIError;
