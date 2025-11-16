import express from "express";
import protect from "../middleware/auth.js";
import {
  createMessage,
  getMessages,
  getUnreadCount,
  markConversationRead,
} from "../controllers/chatController.js";

const router = express.Router();

router.use(protect);

router.get("/:reportId/unread-count", getUnreadCount);
router.post("/:reportId/read", markConversationRead);
router.get("/:reportId", getMessages);
router.post("/:reportId", createMessage);

export default router;
