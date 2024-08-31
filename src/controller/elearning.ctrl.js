//Constants
import ResponseCodes from "../global/constants/responseCodes.const.js";
//Utilities
import logger from "../global/utilities/logger.js";
import errorHandler from "../global/utilities/error/errorHandler.js";
import HttpStatusCodes from "../global/constants/httpStatusCodes.const.js";
import {
  getLessonProgressSrvc,
  updateLessonProgressSrvc,
} from "../services/elearning.srvc.js";

export const getCourseProgressCtrl = async (req, res, next) => {
  const user = req.user;
  try {
    if (!user) {
      return res.status(HttpStatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized Access to Resource",
        code: ResponseCodes.AUTH__UNAUTHORIZED_ACCESS,
      });
    }
    const result = await getLessonProgressSrvc(user.id);
    if (errorHandler.isTrustedError(result)) return next(result);
    return res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "Course Progress",
      result: { module: result.module, lesson: result.lesson },
    });
  } catch (error) {
    logger.trace("CTRL ERROR: Was not able to get lesson progress");
    next(error);
  }
};

export const updateCourseProgressCtrl = async (req, res, next) => {
  const { module, lesson } = req.body;
  const user = req.user;
  try {
    const result = await updateLessonProgressSrvc(user.id, module, lesson);
    if (errorHandler.isTrustedError(result)) return next(result);
    return res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "Course progress updated",
      result: { module, lesson },
    });
  } catch (error) {
    logger.trace("CTRL ERROR: Was not able to get lesson progress");
    next(error);
  }
};
