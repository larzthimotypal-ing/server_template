//<--DEPENDENCIES-->//
//Libraries
import { Router } from "express";
//Controllers
import { postExampleCtrl } from "../layer.controller/example.ctrl/write.js";
//<--DEPENDENCIES-->//

const router = Router();

router.route("/").post(postExampleCtrl);

export default router;
