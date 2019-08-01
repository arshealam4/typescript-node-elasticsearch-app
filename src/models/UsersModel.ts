import * as mongoose from "mongoose";
import db from "../lib/maindb";
const Schema = mongoose.Schema;

export interface IUser {
    _id: string,
    userName: string;
    role: string;
    email: string;
    password: string;
    active: boolean;
    gender: string;
    timestamp: Date;
  }

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
    timestamp: {type: Date, default: Date.now},
});

const model = db.model("Users", usersSchema);

export default model;
