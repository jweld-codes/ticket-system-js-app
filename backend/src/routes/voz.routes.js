import express from "express";
import { generarAudio } from "../controllers/voz.controller.js";

const router = express.Router();

router.post("/tts", generarAudio);

export default router;