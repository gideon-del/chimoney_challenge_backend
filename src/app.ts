import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import authRoute from "./routes/auth.route";
import cookieParser from "cookie-parser";
import "dotenv/config";
const app = express();
app.use(morgan("combined"));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
// Routes
app.use("/auth", authRoute);
export default app;
