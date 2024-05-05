import { Request } from "express";
export type AuthUserRoute = Request & {
  user: {
    id: string;
  };
};
