import logger from "../utilities/logger.js";

const apiLoggerMW = async (req, res, next) => {
  const {
    method,
    url,
    query,
    params,
    // body,
    headers,
    remoteAddress,
    remotePort,
  } = req;
  logger.trace(
    {
      method,
      url,
      headers,
      query,
      params,
      // body,
      remoteAddress,
      remotePort,
      status: "Entry",
    },
    `$(${method})${url} [STATUS]: ENTRY`
  );
  next();
};

export default apiLoggerMW;
