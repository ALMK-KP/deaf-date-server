import {
  addTrackToPlaylist,
  updateTrackCustomTitle,
} from "../controllers/tracksController";
import express from "express";

const router = express.Router();

router.post("/tracks/add", addTrackToPlaylist);
router.put("/tracks/:id", updateTrackCustomTitle);

export default router;
