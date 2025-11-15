import mongoose from "mongoose";
import ChatMessage from "../models/Chat.js";
import Report from "../models/Report.js";

const formatMessageForClient = (messageDoc) => ({
  _id: messageDoc._id.toString(),
  reportId: messageDoc.reportId.toString(),
  sender: messageDoc.sender.toString(),
  senderName: messageDoc.senderName,
  text: messageDoc.text,
  createdAt: messageDoc.createdAt,
});

const ensureValidReport = async (reportId) => {
  if (!mongoose.Types.ObjectId.isValid(reportId)) {
    return null;
  }
  return Report.findById(reportId).select("_id");
};

export const getMessages = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await ensureValidReport(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const messages = await ChatMessage.find({ reportId: report._id })
      .sort({ createdAt: 1 })
      .lean();

    const serialized = messages.map(formatMessageForClient);

    return res.json(serialized);
  } catch (error) {
    console.error("Failed to fetch messages:", error.message);
    return res.status(500).json({ message: "Unable to load messages" });
  }
};

export const createMessage = async (req, res) => {
  try {
    const { reportId } = req.params;
    const trimmedText = req.body?.text?.trim();

    if (!trimmedText) {
      return res.status(400).json({ message: "Message text is required" });
    }

    const report = await ensureValidReport(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const senderName = req.user?.userName || req.user?.email || "Unknown user";

    const newMessage = await ChatMessage.create({
      reportId: report._id,
      sender: req.user._id,
      senderName,
      text: trimmedText,
    });

    const serialized = formatMessageForClient(newMessage);

    const io = req.app.get("io");
    if (io) {
      io.to(serialized.reportId).emit("receive_message", serialized);
    }

    return res.status(201).json(serialized);
  } catch (error) {
    console.error("Failed to create message:", error.message);
    return res.status(500).json({ message: "Unable to send message" });
  }
};
