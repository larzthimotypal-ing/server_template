//Constants
const ResponseCodes = require("../global/constants/responseCodes.const.js");
//Utilities
const logger = require("../global/utilities/logger.js");
const errorHandler = require("../global/utilities/error/errorHandler.js");
const HttpStatusCodes = require("../global/constants/httpStatusCodes.const.js");
const {
  getLessonProgressSrvc,
  getQuizSrvc,
  saveQuizResponseSrvc,
  updateLessonProgressSrvc,
} = require("../services/elearning.srvc.js");

const getCourseProgressCtrl = async (req, res, next) => {
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

const updateCourseProgressCtrl = async (req, res, next) => {
  const { module, lesson } = req.body;
  const user = req.user;
  try {
    const result = await updateLessonProgressSrvc(user.id, module, lesson);
    if (errorHandler.isTrustedError(result)) return next(result);
    return res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "Course progress updated",
      result,
    });
  } catch (error) {
    logger.trace("CTRL ERROR: Was not able to get lesson progress");
    next(error);
  }
};

const getQuizCtrl = async (req, res, next) => {
  const { quizId } = req.params;
  try {
    const result = await getQuizSrvc(quizId);
    if (errorHandler.isTrustedError(result)) return next(result);
    return res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "Quiz fetched successfully",
      result: {
        quizId: result.quizId,
        questions: result.questions,
      },
    });
  } catch (error) {
    logger.trace("CTRL ERROR: Was not able to get lesson progress");
    next(error);
  }
};

const saveQuizResponseCtrl = async (req, res, next) => {
  const user = req.user;
  const { answers } = req.body;
  const { quizId } = req.params;
  try {
    const result = await saveQuizResponseSrvc(user.id, quizId, answers);
    if (errorHandler.isTrustedError(result)) return next(result);
    return res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "Quiz Result saved successfully",
      result,
    });
  } catch (error) {
    logger.trace("CTRL ERROR: Was not able to save quiz response");
    next(error);
  }
};

module.exports = {
  getCourseProgressCtrl,
  updateCourseProgressCtrl,
  getQuizCtrl,
  saveQuizResponseCtrl,
};
