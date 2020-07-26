const { ctrlWrapper } = require("../helpers/server");
const mongoHelper = require("../helpers/mongo");
const router = require("express").Router();

router.get("/", mongoHelper.paginationWrapperMiddleware("user", {  }, { projection: { password: 0 } }));

router.get("/:_id", ctrlWrapper(
    (req) => [
        "user",
        { _id: mongoHelper.ObjectID(req.params._id) },
        { projection: { password: 0, email: 0 } }
    ],
    mongoHelper.find,
    { end: true }
));

router.put("/:_id", ctrlWrapper(
    (req, res, next) => ["user", { _id: req.params._id }, req.body],
    mongoHelper.update,
    { end: true }
))

module.exports = {
    router,
    config: {}
}