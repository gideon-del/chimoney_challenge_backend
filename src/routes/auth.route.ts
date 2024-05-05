import { Router } from "express";
import { registerUserSchema } from "../utils/validator";
import supabase from "../models/supabase";
import { createHashPassword, createTokens } from "../utils/auth";
import { createAccount } from "../controllers/auth.controller";

const authRoute = Router();

authRoute.post("/register", createAccount);

export default authRoute;
