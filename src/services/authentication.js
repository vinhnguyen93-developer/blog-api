const jwt = require("jsonwebtoken");
const jwtCofig = (require("../config").app || {}).jwt;
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

authService.genToken = (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, jwtCofig.secret, jwtCofig.options || {} ,(err, token) => {
            if (err) {
                reject(err);
            };
            resolve(token);
        })
    });
}

module.exports = authService;
