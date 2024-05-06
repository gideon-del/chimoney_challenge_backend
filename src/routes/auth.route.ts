import { Router } from "express";
import {
  createAccount,
  loginController,
  refreshAccessToken,
} from "../controllers/auth.controller";
import { isSignedIn } from "../middleware/auth";

const authRoute = Router();

authRoute.post("/register", createAccount);
authRoute.post("/login", loginController);
authRoute.post("/create-jwt", isSignedIn, refreshAccessToken);

export default authRoute;
