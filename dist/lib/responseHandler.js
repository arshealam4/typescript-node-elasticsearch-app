"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class responseHandler {
    constructor() {
        this.makeResponse = (res, status, code, msg, result) => {
            res.status(code).send({
                status,
                code,
                msg,
                result: result ? result : []
            });
        };
    }
}
exports.default = new responseHandler();
//# sourceMappingURL=responseHandler.js.map