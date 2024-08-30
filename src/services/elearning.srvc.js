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
  getLessonProgress,
  insertLessonProgress,
  updateLessonProgress,
} from "../data/repo/elearning.repo.js";

export const getLessonProgressSrvc = async (id) => {
  try {
    const result = await getLessonProgress(id);
    if (!result) {
      return { module: 0, lesson: 0 };
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

    return result;
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
