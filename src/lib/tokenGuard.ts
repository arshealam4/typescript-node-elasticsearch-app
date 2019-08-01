import * as config from "config";
import * as jwt from "jsonwebtoken";

const loggerName = "[TokenGuard]: ";

const allowedList = [
  "/api/v1/users/login",
  "/api/v1/users/signup",
];

class tokenVerify {
  constructor() { }

  public urlChecker = (url) => {
    for (const allowedUrl of allowedList) {
      if (url.indexOf(allowedUrl) > -1) {
        return true;
      }
    }
  }

  public verifyToken = (req, res, next) => {
    const token = req.headers["x-access-token"] || req.headers.authorization;

    if (this.urlChecker(req.originalUrl)) {
      next();
    } else {
      if (token) {
        jwt.verify(token, config.get("secret"), function(err, decoded) {
          if (err) {
            console.error(loggerName, err.name);
            console.error(loggerName, err.message);
            if (err instanceof jwt.TokenExpiredError) {
                return res.send({success: false, code: 403, msg: "Session expired"});
            }
            return res.send({success: false, code: 400, msg: "Token not valid"});
          } else {
              req.decoded = decoded;
              req.token = token;
              if (req.originalUrl.indexOf("admin") >= 0 &&
                decoded.role !== "admin") {
              console.error(loggerName, req.originalUrl, "not an admin");
              return res.send({success: false, code: 403, msg: "Forbidden"});
            }
            return next();
          }
        });
      } else {
        return res.send({success: false, code: 403, msg: "Forbidden"});
      }
    }
  }
}

export default new tokenVerify();
