const crypto = require("crypto");

const utils = {};

utils.random = (size = 7, format = "hex") => {
    return crypto.randomBytes(size).toString(format);
}

module.exports = utils;