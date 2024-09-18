//<--DEPENDENCIES-->//
//Libraries
const { Router } = require("express");
//Controllers
const {
  getProfileCtrl,
  loginUserCtrl,
  registerUserCtrl,
  updateProfileCtrl,
} = require("../controller/identity.ctrl.js");
//Middlewares
const { authGuard } = require("../global/middlewares/authGuard.mw.js");
//<--DEPENDENCIES-->//

const router = Router();

router.route("/register").post(registerUserCtrl);
router.route("/login").post(loginUserCtrl);
router
  .route("/profile")
  .get(authGuard, getProfileCtrl)
  .patch(authGuard, updateProfileCtrl);

module.exports = router;
