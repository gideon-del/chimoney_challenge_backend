import { Request, Response } from "express";
import {
  comparePassword,
  createHashPassword,
  createTokens,
} from "../utils/auth";
import supabase from "../models/supabase";
import { loginUserSchema, registerUserSchema } from "../utils/validator";
import { TABLE } from "../utils/constants";
export async function createAccount(req: Request, res: Response) {
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

  const userId = data![0]["id"] as string;
  const tokens = createTokens(userId);
  return res.status(200).json(tokens);
}

export async function loginController(req: Request, res: Response) {
  // Validate body
  const user = loginUserSchema.safeParse(req.body);
  if (!user.success) {
    const errorMessages = user.error.issues.map((issues) => ({
      message: `${issues.message}`,
    }));
    return res.status(400).json(errorMessages);
  }
  // Check for user in db
  const { data } = await supabase
    .from(TABLE.users)
    .select()
    .eq("email", user.data.email);
  if (!data || data.length === 0) {
    return res.status(400).json({
      message: "Account not found",
    });
  }
  const userDetails = data[0];
  // Compare password
  const hashedPassword = createHashPassword(user.data.password);
  const correctPassword = await comparePassword(
    userDetails.password,
    hashedPassword
  );

  if (!correctPassword) {
    return res.status(400).json({
      message: "Wrong password",
    });
  }
  // Create token
  const tokens = createTokens(userDetails.id);
  return res.status(200).json(tokens);
}
