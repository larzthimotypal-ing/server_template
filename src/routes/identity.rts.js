//<--DEPENDENCIES-->//
//Libraries
import { Router } from "express";
//Controllers
import {
  loginUserCtrl,
  registerUserCtrl,
} from "../controller/identity.ctrl.js";
//<--DEPENDENCIES-->//

const router = Router();

router.route("/register").post(registerUserCtrl);
router.route("/login").post(loginUserCtrl);

export default router;
