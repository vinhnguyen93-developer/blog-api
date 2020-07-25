const { ctrlWrapper } = require("../helpers/server");
const mongoHelper = require("../helpers/mongo");
const router = require("express").Router();

router.get("/", mongoHelper.paginationWrapperMiddleware("user", {}, { projection: { password: 0 } }));
router.get("/:_id", ctrlWrapper((req) => ["user", { _id: mongoHelper.ObjectID(req.params._id) }, { projection: { password: 0 } }], mongoHelper.find, { end: true }));

module.exports = {
    router,
    config: {}
}