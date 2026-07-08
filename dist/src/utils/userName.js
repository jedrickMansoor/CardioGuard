"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUsername = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const generateUsername = async (name) => {
    const base = name
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-z0-9]/g, "");
    let username = base;
    let counter = 1;
    while (await user_model_1.default.findOne({ userName: username })) {
        username = `${base}${counter}`;
        counter++;
    }
    return username;
};
exports.generateUsername = generateUsername;
