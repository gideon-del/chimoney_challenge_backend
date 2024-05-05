import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());
export default app;
