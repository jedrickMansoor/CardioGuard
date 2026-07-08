"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
function generateAccessToken({ user, role }) {
    const options = {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
    };
    return jsonwebtoken_1.default.sign({
        userId: user._id,
        role: role || user.role,
        name: user.name,
    }, ACCESS_SECRET, options);
}
function generateRefreshToken({ user, role }) {
    const options = {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
    };
    return jsonwebtoken_1.default.sign({
        userId: user._id,
        role: role || user.role,
        name: user.name,
    }, REFRESH_SECRET, options);
}
