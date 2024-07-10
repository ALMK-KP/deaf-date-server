import { addTrackToPlaylist } from "../controllers/tracksController";
import express from "express";

const router = express.Router();

router.post("/tracks/add", addTrackToPlaylist);

export default router;
