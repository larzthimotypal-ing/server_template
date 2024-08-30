//Constants
import ResponseCodes from "../global/constants/responseCodes.const.js";
//Utilities
import logger from "../global/utilities/logger.js";
import errorHandler from "../global/utilities/error/errorHandler.js";
import HttpStatusCodes from "../global/constants/httpStatusCodes.const.js";

export const getCourseProgressCtrl = async (req, res, next) => {
  try {
    const lessonId = req.body;

    return res
      .status(HttpStatusCodes.OK)
      .json({ success: true, message: "Authorized", result: { lessonId } });
  } catch (error) {
    logger.trace("CTRL ERROR: Was not able to get lesson progress");
    next(error);
  }
};
