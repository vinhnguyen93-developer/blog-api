const server = require("../server");

const serverHelper = {};

/**
 * @param {(...params: Array.<any>) => Promise<any> | any} handler
 * @param {(req: Request, res: Response, next: (error: Error) => void) => Array.<any>} paramsHandler
 * @param {{ end: boolean=false  }} options
 * @returns {(req: Request, res: Response, next: (error: Error) => void) => void}
 */
serverHelper.ctrlWrapper = (handler, paramsHandler, options = {}) => {
    return async (req, res, next) => {
        try {
            var params = [];
            if (handler) {
                params = await handler(req, res, next) || []
            }
            
            if (res.headersSent) return;
            var result = await paramsHandler(...params);

            if (options.end) {
                serverHelper.successResponse(res, result);
            }
            
            next();
        } catch (error) {
            serverHelper.errorCommonResponse(res)
            next(error);
        }
    }
};

serverHelper.successResponse = (res, data) => {
    res.status(200).json({
        success: true,
        data: data
    })
}

serverHelper.errorCommonResponse = (res, error = "Something Error") => {
    res.status(400).json({
        success: false,
        error: error && error.toString()
    });
}

serverHelper.notFoundResponse = (res) => {
    res.status(404).json({
        success: false,
        error: "Not Found"
    });
}

module.exports = serverHelper;