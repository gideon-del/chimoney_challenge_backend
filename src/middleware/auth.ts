import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/auth";
import { JsonWebTokenError } from "jsonwebtoken";
function isSignedIn(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader.trim().length == 0) {
      return res.status(401).json({
        message: "Unauthorized Access",
      });
    }
    const isValidToken =
      authHeader.startsWith("Bearer") && authHeader.split(" ").length > 1;
    if (!isValidToken) {
      return res.status(400).json({
        message: "Invalid Token",
      });
    }

    const token = authHeader.split(" ")[1];
    const decodeToken = verifyAccessToken(token);
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
