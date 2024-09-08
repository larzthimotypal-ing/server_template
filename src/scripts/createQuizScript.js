import { createQuizService } from "../services/elearning.srvc.js";
import { m1q } from "../global/constants/quizzesData.const.js";

// node src/scripts/createQuizScript.js
await createQuizService(m1q);
