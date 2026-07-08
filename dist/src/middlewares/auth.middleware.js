"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Get token helper
function getTokenFromRequest(req) {
    return (req.cookies?.accessToken ||
        req.headers.authorization?.replace("Bearer ", ""));
}
// AUTH MIDDLEWARE
const requireAuth = (req, res, next) => {
    const token = getTokenFromRequest(req);
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized",
            token_code: "missing",
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = {
            _id: decoded.userId,
            name: decoded.name,
            role: decoded.role ?? null,
        };
        return next();
    }
    catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Token expired",
                token_code: "expired",
            });
        }
        return res.status(403).json({
            message: "Invalid token",
            token_code: "invalid",
        });
    }
};
exports.requireAuth = requireAuth;
