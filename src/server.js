const express = require("express");

const start = (appConfig) => {
    const apiServer = express();

    const PORT = appConfig.port || 8080;
    apiServer.listen(PORT, () => console.log(`[API-Server] Running on port ${PORT}`));
};

module.exports = {
    start
};