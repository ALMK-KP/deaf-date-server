import {
  addTrackToPlaylist,
  deletePlaylist,
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
router.delete("/playlist/:id", deletePlaylist);

export default router;
