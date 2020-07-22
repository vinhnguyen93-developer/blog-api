const { ctrlWrapper } = require("../helpers/server");
const router = require("express").Router();

router.get("/", ctrlWrapper(null, () => "Hello", { end: true }));

module.exports = {
    router,
    config: {}
}