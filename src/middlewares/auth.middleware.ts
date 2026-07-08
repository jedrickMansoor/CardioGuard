import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Token Payload Type
interface TokenPayload {
  userId: string;
  name: string;
  role?: string | null;
  iat?: number;
  exp?: number;
}

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        name: string;
        role?: string | null;
      };
    }
  }
}

// Get token helper
function getTokenFromRequest(req: Request): string | undefined {
  return (
    req.cookies?.accessToken ||
    req.headers.authorization?.replace("Bearer ", "")
  );
}

// AUTH MIDDLEWARE
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
      token_code: "missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as TokenPayload;

    req.user = {
      _id: decoded.userId,
      name: decoded.name,
      role: decoded.role ?? null,
    };

    return next();
  } catch (err: any) {
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
