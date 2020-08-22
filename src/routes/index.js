const path = require("path");
const fs = require("fs");
const { authentication } = require("../services/authentication");

const getDefaultRoutePath = function (moduleName) {
    var routeName = moduleName.split(".");
    routeName.splice(-1, 1);
    return routeName.join(".");
}

/**
 * @param {Express} server
 * @param {(string="/")} prefix
 * @param {{ byPassAuth: boolean=false, authHeaderKey: string="authorization" }} options
 */
const init = function (server, prefix = "/", { authHeaderKey = "authorization" } = {}) {
    var modules = fs.readdirSync(__dirname);
    const authMiddleware = authentication({ authKey: authHeaderKey });
    const authMiddlewareWithMethod = (methods) => {
        return async (req, res, next) => {
            var method = req.method.toLowerCase();
            if (methods.indexOf(method) != -1) return next();
            authMiddleware(req, res, next);
        }
    }
    for (let index = 0; index < modules.length; index++) {
        var moduleName = modules[index];
        if (moduleName != "index.js" && moduleName.endsWith(".js")) {
            const module = require(path.join(__dirname, moduleName));
            if (typeof module === "object") {
                const { router, config } = module;

                const routePath = path.join(prefix, getDefaultRoutePath(moduleName));
                // if (!config.noAuth) {
                //     server.use(routePath, authMiddleware);
                // } else {
                //     const noAuthConfig = config.noAuth;
                //     for (const subRoute in noAuthConfig) {
                //         var methodNoAuth = noAuthConfig[subRoute];
                //         const subRoutePath = path.join(routePath, subRoute);
                //         if (!Array.isArray(methodNoAuth)) {
                //             methodNoAuth = [methodNoAuth];
                //         }
                //         methodNoAuth = methodNoAuth.map((method) => method.toLowerCase());
                //         server.use(subRoutePath, authMiddlewareWithMethod(methodNoAuth));
                //     }
                // }

                server.use(routePath, router)
            }
        }
    }
}

module.exports = {
    init
}