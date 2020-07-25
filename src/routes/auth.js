const { ctrlWrapper } = require("../helpers/server");
const mongoHelper = require("../helpers/mongo");
const { login } = require("../controllers/auth");
const { genSalt } = require("../services/bcrypt");
const router = require("express").Router();

router.post("/register", ctrlWrapper(async (req) => {
    var password = req.body.password;
    if (password) {
        password = await genSalt(password);
        req.body.password = password;
    }

    return ["user", req.body];
}, mongoHelper.insertOne, { end: true }));

router.post("/login", ctrlWrapper((req) => [req.body.email, req.body.password], login, { end: true }));

module.exports = {
    router,
    config: {}
}