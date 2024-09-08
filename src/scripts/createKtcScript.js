import { createKtcSrvc } from "../services/elearning.srvc.js";
import { m1ktc } from "../global/constants/ktcData.const.js";

// node src/scripts/createKtcScript.js
const result = await createKtcSrvc(m1ktc.quizId, m1ktc.ktc);
