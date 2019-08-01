"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const maindb_1 = require("../lib/maindb");
const Schema = mongoose.Schema;
const usersSchema = new Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    password: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    gender: {
        type: String,
    },
    timestamp: { type: Date, default: Date.now },
});
const model = maindb_1.default.model("Users", usersSchema);
exports.default = model;
//# sourceMappingURL=UsersModel.js.map