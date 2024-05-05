import { Router } from "express";
import { registerUserSchema } from "../utils/validator";
import supabase from "../models/supabase";
import { createHashPassword } from "../utils/auth";

const authRoute = Router();

authRoute.post("/register", async (req, res) => {
  const user = registerUserSchema.safeParse(req.body);
  if (!user.success) {
    const errorMessages = user.error.issues.map((issues) => ({
      message: `${issues.path.join(".")} is ${issues.message}`,
    }));
    return res.status(400).json(errorMessages);
  }
  // Check if user already exists
  const { data: userExists } = await supabase
    .from("users")
    .select()
    .eq("email", user.data.email);
  if (userExists && userExists.length > 0) {
    return res.status(400).json({
      message: "Email already taken",
    });
  }
  //   Create a hash password and save to db
  const hashedPassword = createHashPassword(user.data.password);
  const { data, error } = await supabase
    .from("users")
    .insert({
      ...user.data,
      password: hashedPassword,
    })
    .select();
  console.error(error);
  return res.status(200).json(data);
});

export default authRoute;
