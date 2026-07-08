"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_1 = __importDefault(require("cookie"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectedUsers = new Map();
// -------------------
// SOCKET INIT
// -------------------
const initializeSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
            credentials: true,
        },
        transports: ["websocket"],
    });
    // Middleware
    io.use((socket, next) => {
        try {
            let token = null;
            // Check Authorization Header
            const authHeader = socket.handshake.headers.authorization;
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }
            // Check Cookies if no Authorization header
            if (!token) {
                const rawCookie = socket.handshake.headers.cookie;
                if (!rawCookie)
                    return next(new Error("No authentication provided"));
                const parsedCookies = cookie_1.default.parse(rawCookie);
                token = parsedCookies.refreshToken;
            }
            if (!token)
                return next(new Error("Token missing"));
            // Verify Token
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
            // Attach User to Socket 
            socket.user = {
                userId: decoded.userId,
                name: decoded.name,
                role: decoded.role || null,
            };
            next();
        }
        catch (err) {
            console.error("Socket Auth Error:", err.message);
            next(new Error("Unauthorized socket connection"));
        }
    });
    // Connection
    io.on("connection", (socket) => {
        console.log("Connected:", socket.id);
        const userId = socket.user.userId;
        socket.on("join", () => {
            if (!connectedUsers.has(userId)) {
                connectedUsers.set(userId, {
                    socketIds: new Set([socket.id]),
                    name: socket.user.name,
                    role: socket.user.role,
                });
            }
            else {
                connectedUsers.get(userId).socketIds.add(socket.id);
            }
            io.emit("user_list", Array.from(connectedUsers.entries()).map(([id, u]) => ({
                userId: id,
                name: u.name,
                role: u.role,
            })));
        });
        socket.on("disconnect", () => {
            const user = connectedUsers.get(userId);
            if (user) {
                user.socketIds.delete(socket.id);
                if (user.socketIds.size === 0) {
                    connectedUsers.delete(userId);
                }
            }
            io.emit("user_list", Array.from(connectedUsers.entries()).map(([id, u]) => ({
                userId: id,
                name: u.name,
                role: u.role,
            })));
        });
    });
    return io;
};
exports.initializeSocket = initializeSocket;
