"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./src/index"));
const db_1 = require("./src/config/db");
const http_1 = __importDefault(require("http"));
const socket_server_1 = require("./src/socket/socket.server");
// Database connection
(0, db_1.connectDB)();
// Create HTTP server
const server = http_1.default.createServer(index_1.default);
// Initialize Socket.io
(0, socket_server_1.initializeSocket)(server);
const PORT = Number(process.env.PORT) || 9001;
// IMPORTANT: use server.listen, NOT app.listen
server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
