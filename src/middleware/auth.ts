import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/auth";
import { JsonWebTokenError } from "jsonwebtoken";
import { tokenSchema } from "../utils/validator";
import { z } from "zod";
import { TOKEN_TYPE } from "../utils/constants";
interface UserRequest extends Request {
  user?: z.infer<typeof tokenSchema>;
}
export function isSignedIn(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies[TOKEN_TYPE.access];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized access",
      });
    }
    const decodeToken = verifyAccessToken(token);
    const { success: isValid } = tokenSchema.safeParse(decodeToken);
    if (!isValid) {
      return res.status(400).json({
        message: "invalid token",
      });
    }
    req["user"] = decodeToken as z.infer<typeof tokenSchema>;
    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return res.status(401).json({
        message: "Unauthorized access",
      });
    } else {
      return res.status(500).json({
        message: "Internal Server error",
      });
    }
  }
}
