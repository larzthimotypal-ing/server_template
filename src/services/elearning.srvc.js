//Libraries
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
//Constants
import HttpStatusCodes from "../global/constants/httpStatusCodes.const.js";
import APIError from "../global/utilities/error/apiError.js";
import ResponseCodes from "../global/constants/responseCodes.const.js";
//Utilities
import logger from "../global/utilities/logger.js";
//Repositories
import { findUserById } from "../data/repo/identity.repo.js";
import {
  createQuiz,
  getLessonProgress,
  getQuiz,
  insertLessonProgress,
  updateLessonProgress,
} from "../data/repo/elearning.repo.js";
import QuizesLock from "../global/constants/quizesLock.const.js";

export const getLessonProgressSrvc = async (id) => {
  try {
    const result = await getLessonProgress(id);
    if (!result) {
      return { module: 0, lesson: 0 };
    }
    const lessonKeyArray = [result.module, result.lesson];
    const lessonKey = lessonKeyArray.join("-");
    if (lessonKey in QuizesLock) {
      return QuizesLock[lessonKey];
    }

    return result;
  } catch (error) {
    logger.trace("SRVC ERROR: Was not able to get lesson progress");
    return new APIError(
      "SERVICE",
      HttpStatusCodes.INTERNAL_SERVER,
      true,
      "Error in getting lesson progress"
    );
  }
};

export const updateLessonProgressSrvc = async (id, module, lesson) => {
  try {
    const progress = await getLessonProgress(id);
    let result;
    if (!progress) {
      result = await insertLessonProgress(id, module, lesson);
    } else {
      result = await updateLessonProgress(id, module, lesson);
    }
    const lessonKeyArray = [module, lesson];
    const lessonKey = lessonKeyArray.join("-");
    if (lessonKey in QuizesLock) {
      return QuizesLock[lessonKey];
    }
    return { module, lesson };
  } catch (error) {
    logger.trace("SRVC ERROR: Was not able to update lesson progress");
    return new APIError(
      "SERVICE",
      HttpStatusCodes.INTERNAL_SERVER,
      true,
      "Error in updating lesson progress"
    );
  }
};

export const createQuizService = async (options) => {
  const { quizId, questions } = options;
  try {
    const quiz = await createQuiz(quizId, questions);
    logger.info("Quiz Created Successfully");
  } catch (error) {
    logger.trace("SRVC ERROR: Was not able to create quizzes");
  }
};

export const getQuizSrvc = async (quizId) => {
  try {
    const quiz = await getQuiz(quizId);
    if (!quiz) {
      return new APIError(
        "SERVICE",
        HttpStatusCodes.NOT_FOUND,
        true,
        "Error in getting quiz"
      );
    }
    return quiz;
  } catch (error) {
    logger.trace("SRVC ERROR: Was not able to get lesson progress");
    return new APIError(
      "SERVICE",
      HttpStatusCodes.INTERNAL_SERVER,
      true,
      "Error in getting quiz"
    );
  }
};
