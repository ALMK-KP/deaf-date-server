import {
  addTrackToPlaylist,
  getPlaylist,
  updateTrackCustomTitle,
} from "../controllers/tracksController";
import express from "express";

const router = express.Router();

router.post("/tracks/add", addTrackToPlaylist);
router.put("/tracks/:id", updateTrackCustomTitle);
router.get("/playlist/:id", getPlaylist);

export default router;
