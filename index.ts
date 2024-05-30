import express from "express";
import "dotenv/config";
import cors from "cors";
import { convertVideoToAudio } from "./services/convert";

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/convert/:ytVideoId", (req, res) => {
  const { ytVideoId } = req.params;
  res.send(convertVideoToAudio(ytVideoId));
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
