//Libraries
import mysql from "mysql2";
import Datastore from "nedb-promises";
//Constants
import HttpStatusCodes from "../../global/constants/httpStatusCodes.const.js";
import APIError from "../../global/utilities/error/apiError.js";
//Utilities
import logger from "../../global/utilities/logger.js";
const users = Datastore.create("Users.db");
const progress = Datastore.create("Progress.db");
const quizzes = Datastore.create("Quizzes.db");
const keyToCorrection = Datastore.create("KeyToCorrection.db");

export const getLessonProgress = async (id) => {
  try {
    const result = await progress.findOne({ _id: id });
    return result;
  } catch (error) {
    logger.trace("REPO ERROR: Was not able to get lesson progress");
    return new APIError(
      "DATABASE_ACCESS",
      HttpStatusCodes.INTERNAL_SERVER,
      true,
      "Error in getting lesson progress"
    );
  }
};

export const updateLessonProgress = async (id, module, lesson) => {
  try {
    const result = await progress.updateOne({ _id: id }, { module, lesson });
    return result;
  } catch (error) {
    logger.trace("REPO ERROR: Was not able to update lesson progress");
    return new APIError(
      "DATABASE_ACCESS",
      HttpStatusCodes.INTERNAL_SERVER,
      true,
      "Error in updating lesson progress"
    );
  }
};

export const insertLessonProgress = async (id, module, lesson) => {
  try {
    const result = await progress.insert({
      _id: id,
      module,
      lesson,
    });
    return result;
  } catch (error) {
    logger.trace("REPO ERROR: Was not insert lesson progress");
    return new APIError(
      "DATABASE_ACCESS",
      HttpStatusCodes.INTERNAL_SERVER,
      true,
      "Error in inserting lesson progress"
    );
  }
};

export const createQuiz = async (quizId, questions) => {
  try {
    const result = await quizzes.insert({ _id: quizId, questions });
    return result;
  } catch (error) {
    logger.trace("REPO ERROR: Was not insert lesson progress");
    return new APIError(
      "DATABASE_ACCESS",
      HttpStatusCodes.INTERNAL_SERVER,
      true,
      "Error in inserting lesson progress"
    );
  }
};

export const getQuiz = async (quizId) => {
  try {
    const result = await quizzes.findOne({ _id: quizId });
    return result;
  } catch (error) {
    logger.trace("REPO ERROR: Was not able to find quiz");
    return new APIError(
      "DATABASE_ACCESS",
      HttpStatusCodes.INTERNAL_SERVER,
      true,
      "Error in inserting lesson progress"
    );
  }
};

export const createKtc = async (quizId, ktc) => {
  try {
    const result = await keyToCorrection.insert({ _id: quizId, ktc });
    return result;
  } catch (error) {
    logger.trace("REPO ERROR: Was not able to create a key to correction");
    return new APIError(
      "DATABASE_ACCESS",
      HttpStatusCodes.INTERNAL_SERVER,
      true,
      "Error in creating key to correction"
    );
  }
};

export const getKtc = async (quizId) => {
  try {
    const result = await keyToCorrection.findOne({ _id: quizId });
    return result;
  } catch (error) {
    logger.trace("REPO ERROR: Was not able to find key to correction");
    return new APIError(
      "DATABASE_ACCESS",
      HttpStatusCodes.INTERNAL_SERVER,
      true,
      "Error in getting key to correction"
    );
  }
};
