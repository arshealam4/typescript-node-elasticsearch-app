import * as express from "express";
const router = express.Router();
import userController from "../controllers/userController";

/* GET users listing. */
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/user-list/:pageNo?/:limit?", userController.getUserList);

export default router;
