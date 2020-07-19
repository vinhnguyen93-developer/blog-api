const devConfig = require("./development");
const prodConfig = require("./production");

const config = {};

if (process.env == "production") {
    Object.assign(config, prodConfig);
} else {
    Object.assign(config, devConfig);
}

module.exports = config;