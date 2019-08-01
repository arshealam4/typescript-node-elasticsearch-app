"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseHandler_1 = require("./responseHandler");
class errorHandler {
    constructor() {
        this.routeNotFound = (req, res) => {
            return responseHandler_1.default.makeResponse(res, false, 404, "route not found", []);
        };
    }
}
exports.default = new errorHandler();
//# sourceMappingURL=errorHandler.js.map