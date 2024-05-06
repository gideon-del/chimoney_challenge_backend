import jwt, { JsonWebTokenError } from "jsonwebtoken";
import "dotenv/config";
import bcrypt from "bcryptjs";
import { ACCESS_TOKEN_TIME, REFRESH_TOKEN_TIME, TOKEN_TYPE } from "./constants";
import { Response } from "express";

export function createTokens(userId: string) {
  const accessToken = jwt.sign(
    { userId, type: TOKEN_TYPE.access },
    process.env.JWT_SECRET!,
    {
      expiresIn: ACCESS_TOKEN_TIME,
    }
  );
  const refreshToken = jwt.sign(
    { userId, type: TOKEN_TYPE.refresh },
    process.env.JWT_SECRET!,
    {
      expiresIn: REFRESH_TOKEN_TIME,
    }
  );

  return { accessToken, refreshToken };
}
export function verifyAccessToken(token: string) {
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
  return decodedToken;
}
export function createHashPassword(password: string) {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
}
export async function comparePassword(
  password: string,
  hashedPassword: string
) {
  return bcrypt.compareSync(password, hashedPassword);
}

export async function decodeRefreshToken(refreshToken: string) {
  return jwt.verify(refreshToken, process.env.JWT_SECRET!);
}
export async function createAccessToken(refreshToken: string, userId: string) {
  return jwt.sign(
    { userId, type: TOKEN_TYPE.access },
    process.env.JWT_SECRET!,
    {
      expiresIn: ACCESS_TOKEN_TIME,
    }
  );
}
