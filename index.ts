import express from "express";
import "dotenv/config";
import cors from "cors";
import routes from "./routes/routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
