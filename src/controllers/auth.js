const mongoHelper = require("../helpers/mongo");
const serverHelper = require("../helpers/server");
const { compare } = require("../services/bcrypt");
const { genToken } = require("../services/authentication");

const Controller = {}

Controller.login = async (email, password) => {
    const user = await mongoHelper.find("user", {
        email: email
    });

    const matched = await compare(password, (user || {}).password);
    if (!matched) {
        return serverHelper.errorCommonResponse("email or password incorrect");
    }

    const token = await genToken({ _id: user._id.toString() });
    const { password: _, ...payload } = user;
    return {
        ...payload,
        token: token
    }
};

module.exports = Controller;