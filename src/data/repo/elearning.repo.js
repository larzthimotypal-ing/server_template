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
const quizResponse = Datastore.create("QuizResponse.db");

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

export const createQuiz = async (quizId, questions, totalItems) => {
  try {
    const result = await quizzes.insert({ _id: quizId, questions, totalItems });
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

export const saveQuizResponse = async (quizId, userId, quizResult) => {
  try {
    const result = await quizResponse.insert({
      userId,
      quizId,
      quizResult,
    });
    return result;
  } catch (error) {
    logger.trace("REPO ERROR: Was not able to save quiz response");
    return new APIError(
      "DATABASE_ACCESS",
      HttpStatusCodes.INTERNAL_SERVER,
      true,
      "Error in saving quiz response"
    );
  }
};

export const updateQuizResponse = async (quizId, userId, quizResult) => {
  try {
    const result = await quizResponse.update(
      { userId, quizId },
      { userId, quizId, quizResult }
    );
    return result;
  } catch (error) {
    logger.trace("REPO ERROR: Was not able to update quiz response");
    return new APIError(
      "DATABASE_ACCESS",
      HttpStatusCodes.INTERNAL_SERVER,
      true,
      "Error in updating quiz response"
    );
  }
};

export const getQuizResponse = async (quizId, userId) => {
  try {
    const result = await quizResponse.findOne({ userId, quizId });
    return result;
  } catch (error) {
    logger.trace("REPO ERROR: Was not able to get quiz response");
    return new APIError(
      "DATABASE_ACCESS",
      HttpStatusCodes.INTERNAL_SERVER,
      true,
      "Error in getting quiz response"
    );
  }
};
