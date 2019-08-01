"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const userController_1 = require("../controllers/userController");
/* GET users listing. */
router.post("/signup", userController_1.default.signup);
router.post("/login", userController_1.default.login);
router.get("/user-list/:pageNo?/:limit?", userController_1.default.getUserList);
exports.default = router;
//# sourceMappingURL=users.js.map