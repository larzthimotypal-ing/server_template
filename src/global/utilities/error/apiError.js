import HttpStatusCodes from "./../../constants/httpStatusCodes.const.js";
import BaseError from "./baseError.js";
import ResponseCodes from "../../constants/responseCodes.const.js";

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

export default APIError;

// function newAPIError(name, httpCode, isOperational, desc) {
//   const newError = new APIError(name, httpCode, isOperational, desc);
//   return newError;
// }

// export default newAPIError;
