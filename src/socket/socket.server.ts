import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import dotenv from "dotenv";
dotenv.config();

// -------------------
// Type Declarations
// -------------------
interface SocketUser {
  userId: string;
  name: string;
  role?: string | null;
}

interface ConnectedUser {
  socketIds: Set<string>;
  name: string;
  role?: string | null;
}

interface RefreshTokenPayload {
  userId: string;
  name: string;
  role?: string | null;
  iat?: number;
  exp?: number;
}

// Extend Socket.IO
declare module "socket.io" {
  interface Socket {
    user: SocketUser;
  }
}

const connectedUsers = new Map<string, ConnectedUser>();

// -------------------
// SOCKET INIT
// -------------------
export const initializeSocket = (server: HttpServer) => {
  const io = new Server(server, {
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
        if (!rawCookie) return next(new Error("No authentication provided"));

        const parsedCookies = cookie.parse(rawCookie);
        token = parsedCookies.refreshToken;
      }

      if (!token) return next(new Error("Token missing"));

      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET!,
      ) as RefreshTokenPayload;

      socket.user = {
        userId: decoded.userId,
        name: decoded.name,
        role: decoded.role || null,
      };

      next();
    } catch (err: any) {
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
      } else {
        connectedUsers.get(userId)!.socketIds.add(socket.id);
      }

      io.emit(
        "user_list",
        Array.from(connectedUsers.entries()).map(([id, u]) => ({
          userId: id,
          name: u.name,
          role: u.role,
        })),
      );
    });

    socket.on("disconnect", () => {
      const user = connectedUsers.get(userId);
      if (user) {
        user.socketIds.delete(socket.id);
        if (user.socketIds.size === 0) {
          connectedUsers.delete(userId);
        }
      }

      io.emit(
        "user_list",
        Array.from(connectedUsers.entries()).map(([id, u]) => ({
          userId: id,
          name: u.name,
          role: u.role,
        })),
      );
    });
  });

  return io;
};
