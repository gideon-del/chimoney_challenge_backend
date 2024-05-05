import { Request, Response, NextFunction } from "express";
function isSignedIn(req: Request, res: Response, next: NextFunction) {
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
}
