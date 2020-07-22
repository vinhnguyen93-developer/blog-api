const authService = {};

/**
* @param {{ byPass: boolean=false, authKey: string="authorization" }} options
* @returns {(req: Request, res: Response, next: () => void) => void}
*/
authService.authentication = function ({ byPass = false, authKey = "authorization" } = {}) {

    return async function (req, res, next) {
        try {
            // implement late
            const authValue = req.headers[authKey];
            
            return next();
        } catch (error) {

        }
    }
}

module.exports = authService;
