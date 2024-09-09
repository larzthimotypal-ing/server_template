import { createQuizService } from "../services/elearning.srvc.js";
import {
  m1q,
  m2q,
  m3q,
  m4q,
  m5q,
  m6q,
  pretest,
  posttest,
} from "../global/constants/quizzesData.const.js";
import logger from "../global/utilities/logger.js";

// node src/scripts/createQuizScript.js

export const createQuizScript = async () => {
  try {
    await createQuizService(m1q);
    await createQuizService(m2q);
    await createQuizService(m3q);
    await createQuizService(m4q);
    await createQuizService(m5q);
    await createQuizService(m6q);
    await createQuizService(pretest);
    await createQuizService(posttest);
  } catch (error) {
    logger.error("Create Quiz Script was not run successfully");
  }
};
