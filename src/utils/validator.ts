import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string({
    required_error: "name is required",
  }),
  email: z
    .string({
      required_error: "email is required",
    })
    .email("Invalid email"),
  password: z
    .string({
      required_error: "password is required",
    })
    .min(8, "Minimum of 8 charcters"),
});
