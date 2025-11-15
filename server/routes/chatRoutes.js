import express from "express";
import protect from "../middleware/auth.js";
import { createMessage, getMessages } from "../controllers/chatController.js";

const router = express.Router();

router.use(protect);

router.get("/:reportId", getMessages);
router.post("/:reportId", createMessage);

export default router;
