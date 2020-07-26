const server = require("../server");

const serverHelper = {};

/**
 * @param {(...params: Array.<any>) => Promise<any> | any} handler
 * @param {(req: Request, res: Response, next: (error: Error) => void) => Array.<any>} paramsHandler
 * @param {{ end: boolean=false, requestEndWithoutData: boolean, transformBeforeEnd: (req: Request, value: any) => any, pipe: { key: string, transform: (value: any) => any, allowNull: boolean }  }} options
 * @returns {(req: Request, res: Response, next: (error: Error) => void) => void}
 */
serverHelper.ctrlWrapper = (handler, paramsHandler, options) => {
    return async (req, res, next) => {
        try {
            var params = [];
            if (handler) {
                params = await handler(req, res, next) || []
            }
            const { end, pipe, requestEndWithoutData, transformBeforeEnd } = options;

            if (res.headersSent) return;
            var result = await paramsHandler(...params);

            if (end) {
                var responseData = result;
                if (typeof responseData == "object") {
                    responseData = Array.isArray(responseData) ? [...responseData] : {...responseData }
                }
                if (!requestEndWithoutData && transformBeforeEnd) {
                    responseData = transformBeforeEnd(req, responseData);
                }
                serverHelper.successResponse(res, requestEndWithoutData ? undefined : responseData);
            }

            if (pipe) {
                const { key, transform, allowNull } = options.pipe;
                var pipeData = result;
                if (pipeData || (pipeData == null && allowNull)) {
                    if (transform) {
                        pipeData = transform(pipeData);
                    }
                    
                    req[key] = pipeData;
                }
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