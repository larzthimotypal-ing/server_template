//<--DEPENDENCIES-->//
//Constants
import ResponseCodes from "../../global/constants/responseCodes.const.js";
//Utilities
import logger from "../../global/utilities/logger.js";
import APIError from "../../global/utilities/error/apiError.js";
import HttpStatusCodes from "../../global/constants/httpStatusCodes.const.js";
//<--DEPENDENCIES-->//

export const postExampleCtrl = async (req, res, next) => {
  const { test } = req.body;
  try {
    if (!test) {
      throw new APIError(
        "NOT FOUND",
        HttpStatusCodes.NOT_FOUND,
        true,
        "Error Testing"
      );
    }
    return res
      .status(201)
      .send({ code: ResponseCodes.SUCCESS, message: "Successful Request" });
  } catch (error) {
    logger.error("CTRL ERROR: Was not able to post example");
    return next(error);
  }
};
