import app from "./src/index";
import { connectDB } from "./src/config/db";
import http from "http";
import { initializeSocket } from "./src/socket/socket.server";

// Database connection
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
initializeSocket(server);

const PORT = Number(process.env.PORT) || 9001;

// IMPORTANT: use server.listen, NOT app.listen
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});