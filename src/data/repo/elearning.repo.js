//Libraries
const Datastore = require("nedb-promises");
//Constants
const HttpStatusCodes = require("../../global/constants/httpStatusCodes.const.js");
const APIError = require("../../global/utilities/error/apiError.js");
//Utilities
const logger = require("../../global/utilities/logger.js");
const users = Datastore.create("Users.db");
const progress = Datastore.create("Progress.db");
const quizzes = Datastore.create("Quizzes.db");
const keyToCorrection = Datastore.create("KeyToCorrection.db");
const quizResponse = Datastore.create("QuizResponse.db");
//MongoDb Models
const Progress = require("../models/Progress.model.js");
const QuizResponse = require("../models/QuizResponse.model.js");

const getLessonProgress = async (userId) => {
  try {
    const result = await Progress.findOne({ userId }).lean();
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

const updateLessonProgress = async (userId, module, lesson) => {
  try {
    const progress = await Progress.findOneAndUpdate(
      { userId },
      { $set: { module, lesson } },
      { new: true }
    ).lean();

    return progress;
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

const insertLessonProgress = async (userId, module, lesson) => {
  try {
    const newProgress = new Progress({ userId, module, lesson });
    await newProgress.save();

    return newProgress;
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

const createQuiz = async (quizId, questions, totalItems) => {
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

const getQuiz = async (quizId) => {
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

const createKtc = async (quizId, ktc) => {
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

const getKtc = async (quizId) => {
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

const saveQuizResponse = async (quizId, userId, quizResult) => {
  try {
    const newQuizResponse = new QuizResponse({
      quizId,
      userId,
      quizResult,
    });
    await newQuizResponse.save();
    return newQuizResponse;
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

const updateQuizResponse = async (quizId, userId, quizResult) => {
  try {
    const result = await QuizResponse.findOneAndUpdate(
      { userId, quizId },
      { $set: { userId, quizId, quizResult } },
      { new: true }
    ).lean();
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

const getQuizResponse = async (quizId, userId) => {
  try {
    const result = await QuizResponse.findOne({ userId, quizId }).lean();
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

module.exports = {
  getLessonProgress,
  updateLessonProgress,
  insertLessonProgress,
  createQuiz,
  getQuiz,
  createKtc,
  getKtc,
  saveQuizResponse,
  updateQuizResponse,
  getQuizResponse,
};
