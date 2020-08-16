const { ctrlWrapper } = require("../helpers/server");
const mongoHelper = require("../helpers/mongo");
const router = require("express").Router();

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

router.post("/", ctrlWrapper(
  (req) => ["blog", req.body],
  mongoHelper.insertOne,
  { end: true }
));

router.put("/:_id", ctrlWrapper(
  (req, res, next) => ["blog", { _id: req.params._id }, req.body],
  mongoHelper.update,
  { end: true }
));

router.delete("/:_id", ctrlWrapper(
  (req) => ["comment", { _id: req.params._id }],
  mongoHelper.deleteOne,
  { end: true }
));

module.exports = {
  router,
  config: {}
}