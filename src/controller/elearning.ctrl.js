//Constants
import ResponseCodes from "../global/constants/responseCodes.const.js";
//Utilities
import logger from "../global/utilities/logger.js";
import errorHandler from "../global/utilities/error/errorHandler.js";
import HttpStatusCodes from "../global/constants/httpStatusCodes.const.js";
import {
  getLessonProgressSrvc,
  getQuizSrvc,
  saveQuizResponseSrvc,
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
      result,
    });
  } catch (error) {
    logger.trace("CTRL ERROR: Was not able to get lesson progress");
    next(error);
  }
};

export const getQuizCtrl = async (req, res, next) => {
  const { quizId } = req.params;
  try {
    const result = await getQuizSrvc(quizId);
    if (errorHandler.isTrustedError(result)) return next(result);
    return res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "Quiz fetched successfully",
      result: {
        quizId: result._id,
        questions: result.questions,
      },
    });
  } catch (error) {
    logger.trace("CTRL ERROR: Was not able to get lesson progress");
    next(error);
  }
};

export const saveQuizResponseCtrl = async (req, res, next) => {
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
const requestPayload = {
  quizId: "tempid-qz1",
  questions: [
    {
      id: "tempid-q1",
      type: "radio",
      questionaire: "This is a test question?",
      choices: [
        { choiceId: "tempid-c1", value: "This is a sample answer" },
        { choiceId: "tempid-c2", value: "This is a sample answer" },
        { choiceId: "tempid-c3", value: "This is a sample answer" },
        { choiceId: "tempid-c4", value: "This is a sample answer" },
      ],
    },
    {
      id: "tempid-q2",
      type: "checkbox",
      questionaire: "This is a test question?",
      choices: [
        { choiceId: "tempid-c1", value: "This is a sample answer" },
        { choiceId: "tempid-c2", value: "This is a sample answer" },
        { choiceId: "tempid-c3", value: "This is a sample answer" },
        { choiceId: "tempid-c4", value: "This is a sample answer" },
      ],
    },
    {
      id: "tempid-q3",
      type: "radio",
      questionaire: "This is a test question?",
      choices: [
        { choiceId: "tempid-c1", value: "This is a sample answer" },
        { choiceId: "tempid-c2", value: "This is a sample answer" },
        { choiceId: "tempid-c3", value: "This is a sample answer" },
        { choiceId: "tempid-c4", value: "This is a sample answer" },
      ],
    },
    {
      id: "tempid-q4",
      type: "checkbox",
      questionaire: "This is a test question?",
      choices: [
        { choiceId: "tempid-c1", value: "This is a sample answer" },
        { choiceId: "tempid-c2", value: "This is a sample answer" },
        { choiceId: "tempid-c3", value: "This is a sample answer" },
        { choiceId: "tempid-c4", value: "This is a sample answer" },
      ],
    },
    {
      id: "tempid-q5",
      type: "radio",
      questionaire: "This is a test question?",
      choices: [
        { choiceId: "tempid-c1", value: "This is a sample answer" },
        { choiceId: "tempid-c2", value: "This is a sample answer" },
        { choiceId: "tempid-c3", value: "This is a sample answer" },
        { choiceId: "tempid-c4", value: "This is a sample answer" },
      ],
    },
  ],
};

const postRequestPayload = {
  quizId: "tempid-qz1",
  answers: [
    {
      id: "tempid-q1",
      answers: ["tempid-c1"],
    },
    {
      id: "tempid-q2",
      answers: ["tempid-c1", "tempid-c2"],
    },
    {
      id: "tempid-q3",
      answers: ["tempid-c1", "tempid-c3"],
    },
    {
      id: "tempid-q4",
      answers: ["tempid-c1"],
    },
    {
      id: "tempid-q5",
      answers: ["tempid-c1", "tempid-c2", "tempid-c4"],
    },
  ],
};

const postResponsePayload = {
  quizId: "tempid-qz1",
  answers: [
    {
      id: "tempid-q1",
      correct: true,
    },
    {
      id: "tempid-q2",
      correct: false,
    },
    {
      id: "tempid-q3",
      correct: true,
    },
    {
      id: "tempid-q4",
      correct: false,
    },
    {
      id: "tempid-q5",
      correct: true,
    },
  ],
  passed: false,
};
