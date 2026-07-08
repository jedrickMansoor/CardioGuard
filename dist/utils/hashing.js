"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
// HASH PASSWORD
const hashPassword = async (password) => {
    const saltRounds = 10; // industry standard
    const hashed = await bcrypt_1.default.hash(password, saltRounds);
    return hashed;
};
exports.hashPassword = hashPassword;
// COMPARE PASSWORD
const comparePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt_1.default.compare(plainPassword, hashedPassword);
};
exports.comparePassword = comparePassword;
