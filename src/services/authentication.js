const jwt = require("jsonwebtoken");
const serverHelper = require("../helpers/server");
const mongoHelper = require("../helpers/mongo");
const jwtCofig = (require("../config").app || {}).jwt;
const authService = {};

/**
* @param {{ byPass: boolean=false, authKey: string="authorization" }} options
* @returns {(req: Request, res: Response, next: () => void) => void}
*/


authService.authentication = function ({ authKey = "authorization" } = {}) {

    return async function (req, res, next) {
        const token = req.headers[authKey];
        if (!token) {
            return serverHelper.errorCommonResponse(res, "token is required")
        }

        const isValid = await authService.verifyToken(token);
        if (!isValid) {
            return serverHelper.errorCommonResponse(res, "token is invalid");
        }
        
        const user = await mongoHelper.find("user", { _id: isValid._id });
        if (!user) {
            return serverHelper.errorCommonResponse(res, "user not exist");
        }
        
        req.user = user;
        next();
    }
}

authService.verifyToken = (token) => {
    return new Promise(resolve => {
        jwt.verify(token, jwtCofig.secret, (err, decoded) => {
            if (err) {
                return resolve(false);
            }
            resolve(decoded);
        })
    });
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
