const { Schema, model } = require("mongoose");
const Types = Schema.Types;

const _schema = new Schema({
    blog: {
      type: Types.ObjectId,
      //required: true
    },
    content: {
      type: String,
      required: true
    },
    author: {
      type: Types.ObjectId,
      // required: true
    }
}, { timestamps: true })

model("comment", _schema);