//<--DEPENDENCIES-->//
//Libraries
const { Router } = require("express");
//Controllers
const {
  getCourseProgressCtrl,
  updateCourseProgressCtrl,
  getQuizCtrl,
  saveQuizResponseCtrl,
  generateCertCtrl,
} = require("../controller/elearning.ctrl.js");
//Middlewares
const { authGuard } = require("./../global/middlewares/authGuard.mw.js");
//<--DEPENDENCIES-->//

const router = Router();

router
  .route("/course-progress")
  .get(authGuard, getCourseProgressCtrl)
  .post(authGuard, updateCourseProgressCtrl);

router
  .route("/quiz/:quizId")
  .get(authGuard, getQuizCtrl)
  .post(authGuard, saveQuizResponseCtrl);

router.route("/certificate").get(authGuard, generateCertCtrl);

module.exports = router;
