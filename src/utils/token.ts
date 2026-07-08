import jwt, { SignOptions, Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import { ITokenPayload } from "../interfaces/utils/token.interface";

dotenv.config();


const ACCESS_SECRET: Secret = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET: Secret = process.env.JWT_REFRESH_SECRET!;

export function generateAccessToken({ user, role }: ITokenPayload): string {
  const options: SignOptions = {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES as unknown as SignOptions["expiresIn"],
  };

  return jwt.sign(
    {
      userId: user._id,
      role: role || user.role,
      name: user.name,
    },
    ACCESS_SECRET,
    options
  );
}

export function generateRefreshToken({ user, role }: ITokenPayload): string {
  const options: SignOptions = {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES as unknown as SignOptions["expiresIn"],
  };

  return jwt.sign(
    {
      userId: user._id,
      role: role || user.role,
      name: user.name,
    },
    REFRESH_SECRET,
    options
  );
}