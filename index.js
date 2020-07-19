const config = require("./src/config");
const APIServer = require("./src/server");

const start = (serverConfig) => {

    APIServer.start(serverConfig.app)
}

start(config);

