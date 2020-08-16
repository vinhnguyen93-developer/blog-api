const { ctrlWrapper } = require("../helpers/server");
const mongoHelper = require("../helpers/mongo");
const router = require("express").Router();

router.get("/", ctrlWrapper(
  (req) => ["comment", {  }, { multi: true }],
  mongoHelper.find,
  { end: true }
));

router.get("/:_id", ctrlWrapper(
  (req) => ["comment", { _id: mongoHelper.ObjectID(req.params._id) }],
  mongoHelper.find,
  { end: true }
));

router.post("/", ctrlWrapper(
  (req) => ["comment", req.body],
  mongoHelper.insertOne,
  { end: true }
));

router.put("/:_id", ctrlWrapper(
  (req, res, next) => ["comment", { _id: req.params._id }, req.body],
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