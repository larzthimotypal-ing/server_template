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

export const getLessonProgressSrvc = async (req, res, next) => {
  try {
  } catch (error) {
    logger.trace("SRVC ERROR: Was not able to update lesson progress");
  }
};
