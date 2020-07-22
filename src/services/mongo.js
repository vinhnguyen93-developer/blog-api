const mongoose = require("mongoose");

const onConnected = function () {
    console.log("\x1b[31m%s\x1b[0m", "[Mongo]", "\x1b[0m","Connect succussfully");
}

const onError = function (error) {
    console.log("\x1b[31m%s\x1b[0m", "[Mongo] Error:", "\x1b[0m", error);
}

const connect = async function (mongoConfig) {
    const db = mongoose.connection;
    db.on("error", onError);
    db.on("open", onConnected);

    return await mongoose.connect(mongoConfig.uri, mongoConfig.options)
}

module.exports = {
    connect
}