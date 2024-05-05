import jwt, { JsonWebTokenError } from "jsonwebtoken";
import "dotenv/config";
import bcrypt from "bcryptjs";
const ACCESS_TOKEN_TIME = 86400;
const REFRESH_TOKEN_TIME = 3600 * 24 * 7;
export function createTokens(userId: string) {
  console.log(userId);
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: ACCESS_TOKEN_TIME,
  });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: REFRESH_TOKEN_TIME,
  });
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
  return await bcrypt.compare(password, hashedPassword);
}
