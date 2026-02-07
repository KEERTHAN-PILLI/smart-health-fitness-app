import express from "express";
import { saveProfile } from "../controllers/profileController.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", protect, saveProfile);

export default router;
