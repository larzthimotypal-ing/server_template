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
  createKtc,
  createQuiz,
  getKtc,
  getLessonProgress,
  getQuiz,
  getQuizResponse,
  insertLessonProgress,
  saveQuizResponse,
  updateLessonProgress,
  updateQuizResponse,
} from "../data/repo/elearning.repo.js";
import QuizesLock from "../global/constants/quizesLock.const.js";
import QuizzesId from "../global/constants/quizzesId.const.js";
import nonGradedQuizzes from "../global/constants/nonGradedQuizzes.const.js";

export const getLessonProgressSrvc = async (id) => {
  try {
    const result = await getLessonProgress(id);
    if (!result) {
      return { module: 0, lesson: -1 };
    }
    const lessonKeyArray = [result.module, result.lesson];
    const lessonKey = lessonKeyArray.join("-");
    if (lessonKey in QuizesLock) {
      const quizId = QuizzesId[lessonKey];
      const quizResponse = await getQuizResponse(quizId, id);
      if (quizResponse) {
        if (quizResponse.quizResult.passed) {
          return result;
        }
      }
      if (lessonKey in nonGradedQuizzes) {
        const quizId = QuizzesId[lessonKey];
        const quizResponse = await getQuizResponse(quizId, id);
        logger.fatal(quizResponse);
        if (!quizResponse) {
          return nonGradedQuizzes[lessonKey];
        }
      }
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
    const validateProgressInput = (current, incoming) => {
      const currentValue = current.module * 10 + current.lesson;
      const incomingValue = incoming.module * 10 + incoming.lesson;
      return incomingValue > currentValue;
    };
    if (!progress) {
      result = await insertLessonProgress(id, module, lesson);
    } else {
      const validProgress = validateProgressInput(
        { module: progress.module, lesson: progress.lesson },
        { module, lesson }
      );
      if (validProgress) {
        await updateLessonProgress(id, module, lesson);
        result = { module, lesson };
      } else {
        result = { module: progress.module, lesson: progress.lesson };
      }
    }
    const lessonKeyArray = [module, lesson];
    const lessonKey = lessonKeyArray.join("-");
    if (lessonKey in QuizesLock) {
      return QuizesLock[lessonKey];
    }
    if (lessonKey in nonGradedQuizzes) {
      const quizId = QuizzesId[lessonKey];
      const quizResponse = await getQuizResponse(quizId, id);
      if (!quizResponse) {
        return nonGradedQuizzes[lessonKey];
      }
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

export const createQuizService = async (options) => {
  const { quizId, questions, totalItems } = options;
  try {
    const quiz = await createQuiz(quizId, questions, totalItems);
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
        "Quiz does not exist"
      );
    }
    function getRandomItemsFromArray(arr, num) {
      let count = num;
      if (num > arr.length) {
        count = arr.length;
      }
      const result = [];
      const tempArr = [...arr];

      while (result.length < count) {
        const randomIndex = Math.floor(Math.random() * tempArr.length);
        result.push(tempArr[randomIndex]);
        tempArr.splice(randomIndex, 1);
      }
      return result;
    }
    const randomizedItems = getRandomItemsFromArray(
      quiz.questions,
      quiz.totalItems
    );
    return { quizId: quiz._id, questions: randomizedItems };
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

export const createKtcSrvc = async (quizId, ktc) => {
  try {
    const result = await createKtc(quizId, ktc);
    logger.info("Key to Correction Created Successfully");
    return result;
  } catch (error) {
    logger.trace("SRVC ERROR: Was not able to get lesson progress");
    return new APIError(
      "SERVICE",
      HttpStatusCodes.INTERNAL_SERVER,
      true,
      "Error in creating key to correction"
    );
  }
};

export const saveQuizResponseSrvc = async (userId, quizId, answers) => {
  try {
    const ktcResult = await getKtc(quizId);

    const ktc = ktcResult.ktc;
    if (!ktc) {
      return new APIError(
        "SERVICE",
        HttpStatusCodes.NOT_FOUND,
        true,
        "Quiz does not exist"
      );
    }

    const arraysMatch = (arr1, arr2) => {
      if (arr1.length !== arr2.length) return false;

      const sortedArr1 = arr1.slice().sort();
      const sortedArr2 = arr2.slice().sort();

      for (let i = 0; i < sortedArr1.length; i++) {
        if (sortedArr1[i] !== sortedArr2[i]) {
          return false;
        }
      }
      return true;
    };
    let correct = [];
    let incorrect = [];
    answers.forEach((a) => {
      const ktcItem = ktc.find((k) => k.id === a.id);
      if (ktcItem) {
        const answersMatch = arraysMatch(a.answers, ktcItem.answers);
        if (answersMatch) {
          correct.push({
            id: a.id,
            answer: a.answers,
            correctAnswer: ktcItem.answers,
          });
        } else {
          incorrect.push({
            id: a.id,
            answer: a.answers,
            correctAnswer: ktcItem.answers,
          });
        }
      } else {
        incorrect.push({
          id: a.id,
          answer: a.answers,
          correctAnswer: ktcItem.answers,
        });
      }
    });
    const grade = correct.length / (correct.length + incorrect.length);
    const passed = grade >= 0.8;

    const quizResult = {
      correctAnswers: correct,
      incorrectAnswers: incorrect,
      grade,
      passed,
    };
    let quizResponse;
    const currentQuizResponse = await getQuizResponse(quizId, userId);
    if (!currentQuizResponse) {
      quizResponse = await saveQuizResponse(quizId, userId, quizResult);
    } else {
      quizResponse = await updateQuizResponse(quizId, userId, quizResult);
    }
    return quizResult;
  } catch (error) {
    logger.trace("SRVC ERROR: Was not able to get key to correction");
    return new APIError(
      "SERVICE",
      HttpStatusCodes.INTERNAL_SERVER,
      true,
      "Error in getting key to correction"
    );
  }
};
