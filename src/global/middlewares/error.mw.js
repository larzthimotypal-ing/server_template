const ResponseCodes = require("../constants/responseCodes.const.js");
const errorHandler = require("../utilities/error/errorHandler.js");
const logger = require("../utilities/logger.js");

const errorMW = async (err, req, res, next) => {
  try {
    let logDetails = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      query: req.query,
      params: req.params,
      // body,
      remoteAddress: req.remoteAddress,
      remotePort: req.remotePort,
      status: "ERROR",
      err,
    };
    if (!errorHandler.isTrustedError(err)) {
      logDetails.status = "FATAL ERROR";
      logger.fatal(logDetails);
      process.exit(1);
    }
    let actualErrMsg = null;
    try {
      actualErrMsg = JSON.parse(err.message);
    } catch (e) {
      actualErrMsg = err.message;
    }

    logger.error(logDetails, `(${req.method})${req.url} [STATUS]: ERROR`);
    return res.status(err.httpCode).send({
      success: false,
      code: err.code,
      message: actualErrMsg,
    });
  } catch (error) {
    logger.fatal(error, "Error in error handling mw");
    process.exit(1);
  }
};

module.exports = errorMW;
