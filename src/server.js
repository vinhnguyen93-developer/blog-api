const express = require("express");
const Routes = require("./routes");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const serverHelper = require("./helpers/server");

const applyDefaultMiddleware = function (server, appConfig) {
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: false }));
    if (appConfig.morganEnable) {
        server.use(morgan("combined"));
    }

    if (appConfig.corsMode == "all") {
        server.use(cors());
    }
}

const paginationSecureMiddleware = (config = {}) => {
    return (req, res, next) => {
        var indexConfig = config.index;
        var sizeConfig = config.size;
        if (!indexConfig || !sizeConfig) return next();

        var indexValue = req.query[indexConfig.field];
        var sizeValue = req.query[sizeConfig.field];

        indexValue = indexValue && Number(indexValue);
        sizeValue = sizeValue && Number(sizeValue);

        if (indexValue == null) indexValue = indexConfig.default;
        if (sizeValue == null) sizeValue = sizeConfig.default;

        if (indexValue < indexConfig.min || indexValue > indexConfig.max) {
            serverHelper.errorCommonResponse(res, "Param is invalid");
            return next(false);
        }

        if (sizeValue < sizeConfig.min || sizeValue > sizeConfig.max) {
            serverHelper.errorCommonResponse(res, "Param is invalid");
            return next(false);
        }
        
        req.pagination = {};
        req.pagination.index = indexValue;
        req.pagination.size = sizeValue;

        return next();
    }
}

const secureAPIParam = function (server, params = {}) {
    server.use(paginationSecureMiddleware(params.pagination));
}
const start = (appConfig, apiConfig) => {
    const { port } = appConfig;
    const apiServer = express();

    applyDefaultMiddleware(apiServer, appConfig);

    secureAPIParam(apiServer, apiConfig)

    Routes.init(apiServer, "/api/v1", { byPassAuth: appConfig.bypassAuth, authHeaderKey: appConfig.authHeaderKey });

    apiServer.listen(port, () => {
        console.log("\x1b[36m%s\x1b[0m", `[Server]`, "\x1b[0m", `Running on port ${port}`);
    });
};

module.exports = {
    start
};