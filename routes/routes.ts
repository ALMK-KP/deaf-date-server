import {
  addTrackToPlaylist,
  deleteTrackFromPlaylist,
  getPlaylist,
  updateTrackCustomTitle,
} from "../controllers/tracksController";
import express from "express";

const router = express.Router();

router.post("/tracks/add", addTrackToPlaylist);
router.put("/tracks/:id", updateTrackCustomTitle);
router.delete("/tracks/:id", deleteTrackFromPlaylist);
router.get("/playlist/:id", getPlaylist);

export default router;
