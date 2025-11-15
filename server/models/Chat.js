import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderName: {
      type: String,
      required: true,
      trim: true,
    },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const ChatMessage = mongoose.model("ChatMessage", messageSchema);

export default ChatMessage;
