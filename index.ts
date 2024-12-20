import express from "express";
import "dotenv/config";
import "./websockets";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes/routes";
import compression from "compression";
import helmet from "helmet";
import RateLimit from "express-rate-limit";

const envFile = `.env.${process.env.NODE_ENV}`;
dotenv.config({ path: envFile });

const app = express();

app.use(compression());
app.use(helmet());
app.use(cors());
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 20,
});
app.use(limiter);

app.use(express.json());

app.use("/api", routes);

app.listen(process.env.PORT, () => {
  console.log(`DeafDate server listening on port ${process.env.PORT}`);
});
