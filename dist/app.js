"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const logger = require("morgan");
const path = require("path");
const errorHandler_1 = require("./lib/errorHandler");
// registered all modules
const userModel = require("./models/UsersModel");
userModel;
// registered all routes
const users_1 = require("./routes/users");
const app = express();
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
Promise.resolve().then(() => require("./lib/maindb"));
const API = "/api/v1/";
// app.all(API + "*", [tokenGuard.verifyToken]);
app.use(API + "users", users_1.default);
// catch 404 and forward to error handler
app.use(errorHandler_1.default.routeNotFound);
exports.default = app;
//# sourceMappingURL=app.js.map