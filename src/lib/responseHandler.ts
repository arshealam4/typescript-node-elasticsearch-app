class responseHandler {
    constructor() { }

     public makeResponse = (res, status, code, msg, result) => {

        res.status(code).send({
            status,
            code,
            msg,
            result: result ? result : []
        });
     }
}

export default new responseHandler();
