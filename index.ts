import express from "express";
import "dotenv/config";
import cors from "cors";
import { addTrackToPlaylist } from "./controllers/tracksController";

const app = express();

app.use(cors());

app.post("/tracks/add", (req, res) => {
  const { playlistId, ytVideoId } = req.body;
  res.send(addTrackToPlaylist(playlistId, ytVideoId));
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
