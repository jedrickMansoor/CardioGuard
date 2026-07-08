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
            allowedHeaders: ["Authorization"],
            credentials: true,
        },
        transports: ["websocket", "polling"],
    });
    io.engine.on("connection_error", (err) => {
        console.log("ENGINE ERROR:", err.req.headers);
        console.log("ERROR CODE:", err.code);
    });
    // Middleware
    io.use((socket, next) => {
        try {
            let token = null;
            // 1. Auth object (React Native)
            const authHeader = socket.handshake.auth.token;
            if (authHeader?.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }
            // 2. Header fallback (important fix)
            if (!token) {
                const headerAuth = socket.handshake.headers.authorization;
                if (headerAuth?.startsWith("Bearer ")) {
                    token = headerAuth.split(" ")[1];
                }
            }
            // 3. Cookies fallback
            if (!token) {
                const rawCookie = socket.handshake.headers.cookie;
                if (!rawCookie)
                    return next(new Error("No authentication provided"));
                const parsedCookies = cookie_1.default.parse(rawCookie);
                token = parsedCookies.refreshToken;
            }
            if (!token)
                return next(new Error("Token missing"));
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
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
        console.log("Connected:", socket.id, '', socket.user);
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
