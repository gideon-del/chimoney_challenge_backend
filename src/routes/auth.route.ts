import { Router } from "express";
import { registerUserSchema } from "../utils/validator";
import supabase from "../models/supabase";

const authRoute = Router();

authRoute.post("/register", async (req, res) => {
  const user = registerUserSchema.safeParse(req.body);
  if (!user.success) {
    return res.status(400).json(user.error);
  }
  //   Create a hash password and save to db

  const data = await supabase.from("user");
});

export default authRoute;
