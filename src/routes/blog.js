const { ctrlWrapper } = require("../helpers/server");
const mongoHelper = require("../helpers/mongo");
const router = require("express").Router();
const { authentication } = require("../services/authentication")

router.get("/", ctrlWrapper(
  (req) => ["blog", {}, { multi: true }],
  mongoHelper.find,
  { end: true }
));

router.get("/:_id", ctrlWrapper(
  (req) => ["blog", { _id: mongoHelper.ObjectID(req.params._id) }],
  mongoHelper.find,
  { end: true }
));

router.post("/", authentication(), ctrlWrapper(
  (req) => {
    const data = req.body;
    if (data) {
      data.author = req.user._id;
    }

    return ["blog", data]
  },
  mongoHelper.insertOne,
  { end: true }
));

router.put("/:_id", authentication(), ctrlWrapper(
  (req, res, next) => ["blog", { _id: req.params._id }, req.body],
  mongoHelper.update,
  { end: true }
));

router.delete("/:_id", authentication(), ctrlWrapper(
  (req) => ["comment", { _id: req.params._id }],
  mongoHelper.deleteOne,
  { end: true }
));

module.exports = {
  router,
  config: {}
}