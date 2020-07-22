const config = require("./src/config");
const APIServer = require("./src/server");
const MongoService = require("./src/services/mongo");

const start = async (serverConfig) => {

    APIServer.start(serverConfig.app, serverConfig.api);
    await MongoService.connect(serverConfig.database.mongo)
}

start(config);

