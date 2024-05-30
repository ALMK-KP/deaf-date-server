import express from "express";
import "dotenv/config";
import cors from "cors";
import { getLinkToAudioFile } from "./controllers/audioController";

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// app.get("/audio/play/:linkToFile", (req, res) => {
//  res.send(getAudioFileFromTheCloud(linkToFile));
// });

app.get("/audio/add/:playlistId/:ytVideoId", (req, res) => {
  const { playlistId, ytVideoId } = req.params;
  res.send(getLinkToAudioFile(playlistId, ytVideoId));
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
