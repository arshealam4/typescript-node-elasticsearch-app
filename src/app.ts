import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as express from "express";
import * as createError from "http-errors";
import * as logger from "morgan";
import * as path from "path";
import errorHandler from './lib/errorHandler'

import tokenGuard from "./lib/tokenGuard";

// registered all modules
import * as userModel from "./models/UsersModel";
userModel;

// registered all routes
import usersRouter from "./routes/users";

const app = express();
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

import("./lib/maindb");

const API = "/api/v1/";
// app.all(API + "*", [tokenGuard.verifyToken]);

app.use(API + "users", usersRouter);

// catch 404 and forward to error handler
app.use(errorHandler.routeNotFound);

export default app;
