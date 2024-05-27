import express from "express";
import cors from "cors";
import { convertVideoToAudio } from "./services/convert";

const app = express();
const port = 3000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/convert/:ytVideoId", (req, res) => {
  const { ytVideoId } = req.params;
  res.send(convertVideoToAudio(ytVideoId));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
