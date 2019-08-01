"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const maindb_1 = require("../lib/maindb");
const UsersModel = maindb_1.default.model("Users");
const sha5 = require("js-sha512");
const sha512 = sha5.sha512;
const jwt = require("jsonwebtoken");
const responseHandler_1 = require("../lib/responseHandler");
const elasticsearch = require("elasticsearch");
// create and connect elasticsearch client to local instance.
const client = new elasticsearch.Client({
    host: '127.0.0.1:9200',
    log: 'error'
});
// test elasticsearch
client.ping({ requestTimeout: 30000 }, function (error) {
    if (error) {
        console.error('elasticsearch cluster is down!');
    }
    else {
        console.log('Everything is ok');
    }
});
class userController {
    constructor() {
        this.signup = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const userName = req.body.userName;
            const email = req.body.email;
            const password = req.body.password;
            const gender = req.body.gender;
            if (!userName || !email || !password) {
                return responseHandler_1.default.makeResponse(res, false, 400, "invalid input parameters!", []);
            }
            try {
                const user = yield UsersModel.findOne({ email });
                if (user) {
                    return responseHandler_1.default.makeResponse(res, false, 200, "user already exist!", []);
                }
                const obj = {
                    userName,
                    email,
                    password: sha512(password),
                    gender,
                };
                const userObj = new UsersModel(obj);
                yield userObj.save();
                delete obj.password;
                let count = yield UsersModel.count();
                client.create({
                    index: 'userindex',
                    type: 'users',
                    id: count,
                    body: obj
                });
                return responseHandler_1.default.makeResponse(res, true, 201, "user successfully registered!", []);
            }
            catch (err) {
                return responseHandler_1.default.makeResponse(res, false, 500, "internel server error!", []);
            }
        });
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const email = req.body.email.toLowerCase();
            let password = req.body.password;
            const role = req.body.role ? req.body.role : "user";
            if (!email || !password) {
                return responseHandler_1.default.makeResponse(res, false, 400, "invalid input parameters", []);
            }
            try {
                password = sha512(password);
                const user = yield UsersModel.findOne({ email, password, active: true, role });
                if (!user) {
                    const user = yield UsersModel.findOne({ email, password });
                    if (!user) {
                        return responseHandler_1.default.makeResponse(res, false, 400, "username or password is incorrect!", []);
                    }
                    else if (!user.active) {
                        return responseHandler_1.default.makeResponse(res, false, 400, "user not activated, Please check your email to activate account!", []);
                    }
                    else {
                        return responseHandler_1.default.makeResponse(res, false, 400, "thers is some issue, please try again!", []);
                    }
                }
                else {
                    const token = jwt.sign({
                        _id: user._id,
                        email: user.email,
                        role: user.role,
                    }, config.get("secret"), {
                        expiresIn: config.get("jwt_expiretime"),
                    });
                    return responseHandler_1.default.makeResponse(res, true, 200, "login success", [{ token, email: user.email }]);
                }
            }
            catch (err) {
                return responseHandler_1.default.makeResponse(res, false, 500, "internel server error", []);
            }
        });
        this.getUserList = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const pageNo = parseInt(req.params.pageNo);
            const limit = parseInt(req.params.limit);
            const skip = limit * (pageNo - 1);
            const query = req.query.query;
            const searchParams = {
                index: 'userindex'
            };
            if (limit && pageNo) {
                searchParams['from'] = skip;
                searchParams['size'] = limit;
            }
            else {
                let count = yield UsersModel.count();
                searchParams['size'] = count;
            }
            if (query) {
                searchParams['body'] = {
                    query: {
                        match: {
                            userName: query
                        }
                    }
                };
            }
            const user = yield client.search(searchParams);
            return responseHandler_1.default.makeResponse(res, true, 200, "success", user.hits.hits);
        });
    }
}
exports.default = new userController();
//# sourceMappingURL=userController.js.map