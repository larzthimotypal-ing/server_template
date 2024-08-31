//<--DEPENDENCIES-->//
//Libraries
import { Router } from "express";
//Controllers
import {
  getProfileCtrl,
  loginUserCtrl,
  registerUserCtrl,
} from "../controller/identity.ctrl.js";
//Middlewares
import { authGuard } from "../global/middlewares/authGuard.mw.js";
//<--DEPENDENCIES-->//

const router = Router();

router.route("/register").post(registerUserCtrl);
router.route("/login").post(loginUserCtrl);
router.route("/profile").get(authGuard, getProfileCtrl);

export default router;
