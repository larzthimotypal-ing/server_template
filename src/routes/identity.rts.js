//<--DEPENDENCIES-->//
//Libraries
import { Router } from "express";
//Controllers
import {
  getProfileCtrl,
  loginUserCtrl,
  registerUserCtrl,
  updateProfileCtrl,
} from "../controller/identity.ctrl.js";
//Middlewares
import { authGuard } from "../global/middlewares/authGuard.mw.js";
//<--DEPENDENCIES-->//

const router = Router();

router.route("/register").post(registerUserCtrl);
router.route("/login").post(loginUserCtrl);
router
  .route("/profile")
  .get(authGuard, getProfileCtrl)
  .patch(authGuard, updateProfileCtrl);

export default router;
