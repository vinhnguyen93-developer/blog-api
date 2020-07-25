const { Schema, model } = require("mongoose");
const Types = Schema.Types;

const _schema = new Schema({
    email: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
    },
}, { timestamps: true })

model("user", _schema);
