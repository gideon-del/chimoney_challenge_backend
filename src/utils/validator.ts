import { z } from "zod";

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
