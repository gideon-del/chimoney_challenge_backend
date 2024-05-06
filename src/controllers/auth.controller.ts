import { Request, Response } from "express";
import {
  comparePassword,
  createAccessToken,
  createHashPassword,
  createTokens,
  decodeRefreshToken,
} from "../utils/auth";
import supabase from "../models/supabase";
import { loginUserSchema, registerUserSchema } from "../utils/validator";
import {
  ACCESS_TOKEN_TIME,
  REFRESH_TOKEN_TIME,
  TABLE,
  TOKEN_TYPE,
} from "../utils/constants";
import { JwtPayload } from "jsonwebtoken";
import z from "zod";
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
  res.cookie(TOKEN_TYPE.access, tokens.accessToken, {
    maxAge: ACCESS_TOKEN_TIME,
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res.cookie(TOKEN_TYPE.refresh, tokens.refreshToken, {
    maxAge: REFRESH_TOKEN_TIME,
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
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

  const correctPassword = await comparePassword(
    user.data.password,
    userDetails.password
  );
  console.log(correctPassword);
  if (!correctPassword) {
    return res.status(400).json({
      message: "Wrong password",
    });
  }
  // Create token
  const tokens = createTokens(userDetails.id);
  const refrehCookieTime = REFRESH_TOKEN_TIME * 1000;
  const accesCookieTime = ACCESS_TOKEN_TIME * 1000;
  console.log(refrehCookieTime, accesCookieTime);
  res.cookie(TOKEN_TYPE.access, tokens.accessToken, {
    maxAge: accesCookieTime,
    httpOnly: true,
    secure: false,
  });
  res.cookie(TOKEN_TYPE.refresh, tokens.refreshToken, {
    maxAge: refrehCookieTime,
    httpOnly: true,
    secure: false,
  });

  return res.status(200).json(tokens);
}

export async function refreshAccessToken(req: Request, res: Response) {
  const token = req.cookies[TOKEN_TYPE.refresh];
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized access",
    });
  }
  const decodedToken = (await decodeRefreshToken(token!)) as JwtPayload;
  if (decodedToken.type !== TOKEN_TYPE.refresh) {
    return res.status(400).json({
      message: "Wrong refresh token",
    });
  }
  const newAcessToken = await createAccessToken(token, decodedToken.userId);
  res.cookie(TOKEN_TYPE.access, newAcessToken, {
    maxAge: ACCESS_TOKEN_TIME * 1000,
    httpOnly: true,
  });
  return res.status(200).json({
    access: newAcessToken,
  });
}

export async function logoutUser(req: Request, res: Response) {
  res.cookie(TOKEN_TYPE.access, "", {
    maxAge: 0,
    httpOnly: true,
  });
  res.cookie(TOKEN_TYPE.refresh, "", {
    maxAge: 0,
    httpOnly: true,
  });
  return res.status(200);
}
