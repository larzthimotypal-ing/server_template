//<--DEPENDENCIES-->//
//Libraries
import { Router } from "express";
//Controllers
import {
  getCourseProgressCtrl,
  updateCourseProgressCtrl,
  getQuizCtrl,
} from "../controller/elearning.ctrl.js";
//Middlewares
import { authGuard } from "./../global/middlewares/authGuard.mw.js";
//<--DEPENDENCIES-->//

const router = Router();

router
  .route("/course-progress")
  .get(authGuard, getCourseProgressCtrl)
  .post(authGuard, updateCourseProgressCtrl);

router.route("/quiz/:quizId").get(authGuard, getQuizCtrl);

export default router;
