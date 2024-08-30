//Libraries
import jwt from "jsonwebtoken";
//Constants
import HttpStatusCodes from "../constants/httpStatusCodes.const.js";
import ResponseCodes from "../constants/responseCodes.const.js";
//Utilities
import APIError from "../utilities/error/apiError.js";
import logger from "../utilities/logger.js";

export const authGuard = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader && authHeader.split(" ")[1];

    if (!accessToken) {
      next(
        new APIError(
          "UNAUTHORIZED_ACCESS",
          HttpStatusCodes.UNAUTHORIZED,
          true,
          "Unauthorized Access to Resource",
          ResponseCodes.AUTH__UNAUTHORIZED_ACCESS
        )
      );
    }

    const secret = process.env.ACCESS_TOKEN_SECRET;

    const decodedAccessToken = jwt.verify(accessToken, secret);

    req.user = { id: decodedAccessToken.userId };

    next();
  } catch (error) {
    logger.trace("MW ERROR: Authorization Error");
    next(
      new APIError(
        "UNAUTHORIZED_ACCESS",
        HttpStatusCodes.UNAUTHORIZED,
        true,
        "Unauthorized Access to Resource",
        ResponseCodes.AUTH__UNAUTHORIZED_ACCESS
      )
    );
  }
};
