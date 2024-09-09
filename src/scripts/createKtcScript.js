import { createKtcSrvc } from "../services/elearning.srvc.js";
import {
  m1ktc,
  m2ktc,
  m3ktc,
  m4ktc,
  m5ktc,
  m6ktc,
  pretestktc,
  posttestktc,
} from "../global/constants/ktcData.const.js";
import logger from "../global/utilities/logger.js";

// node src/scripts/createKtcScript.js
export const ktcScript = async () => {
  try {
    await createKtcSrvc(m1ktc.quizId, m1ktc.ktc);
    await createKtcSrvc(m2ktc.quizId, m2ktc.ktc);
    await createKtcSrvc(m3ktc.quizId, m3ktc.ktc);
    await createKtcSrvc(m4ktc.quizId, m4ktc.ktc);
    await createKtcSrvc(m5ktc.quizId, m5ktc.ktc);
    await createKtcSrvc(m6ktc.quizId, m6ktc.ktc);
    await createKtcSrvc(pretestktc.quizId, pretestktc.ktc);
    await createKtcSrvc(posttestktc.quizId, posttestktc.ktc);
  } catch (error) {
    logger.error("KTC Script was not run successfully");
  }
};
