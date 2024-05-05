import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import authRoute from "./routes/auth.route";
const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());
// Routes
app.use("/auth", authRoute);
export default app;
