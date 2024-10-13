const { createQuizService } = require("../services/elearning.srvc.js");
const {
  m1q,
  m2q,
  m3q,
  m4q,
  m5q,
  m6q,
  pretest,
  posttest,
  postSurvey,
} = require("../global/constants/quizzesData.const.js");
const logger = require("../global/utilities/logger.js");

// node src/scripts/createQuizScript.js

const createQuizScript = async () => {
  try {
    await createQuizService(m1q);
    await createQuizService(m2q);
    await createQuizService(m3q);
    await createQuizService(m4q);
    await createQuizService(m5q);
    await createQuizService(m6q);
    await createQuizService(pretest);
    await createQuizService(posttest);
    await createQuizService(postSurvey);
  } catch (error) {
    logger.error("Create Quiz Script was not run successfully");
  }
};

module.exports = { createQuizScript };
