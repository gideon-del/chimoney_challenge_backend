import { z } from "zod";
import { TOKEN_TYPE } from "./constants";

export const registerUserSchema = z.object({
  name: z.string({
    required_error: "name is required",
  }),
  email: z
    .string({
      required_error: "email is required",
    })
    .email("invalid"),
  password: z
    .string({
      required_error: "password is required",
    })
    .min(8, "minimum of 8 charcters"),
});

export const loginUserSchema = z.object({
  email: z
    .string({
      required_error: "email is required",
    })
    .email("invalid"),
  password: z
    .string({
      required_error: "password is required",
    })
    .min(8, "minimum of 8 charcters"),
});
export const tokenSchema = z.object({
  userId: z.string().min(3),
  type: z.enum([TOKEN_TYPE.access, TOKEN_TYPE.refresh]),
});
