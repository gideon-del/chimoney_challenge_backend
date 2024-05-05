import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
function verifyToken(token: string) {}
export function createHashPassword(password: string) {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
}
