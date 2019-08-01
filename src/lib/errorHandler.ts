import responseHandler from './responseHandler'

class errorHandler {
    constructor() { }

     routeNotFound = (req, res) => {
        return responseHandler.makeResponse(res, false, 404, "route not found", []);
     }

}

export default new errorHandler();
