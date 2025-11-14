import React from "react";
import { useEffect } from "react";
import { socket } from "../../utils/socket";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function ChatRoom() {
  const { id: reportId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const user = useSelector((state) => state.user);

  useEffect(() => {
    socket.emit("join_room", reportId);
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
  }, [reportId]);

  function sendMessage() {
    const msg = {
      roomId: reportId,
      sender: user._id,
    };
    socket.emit("send_message", msg);
    setMessages((prev) => [...prev, msg]);
    setText("");
  }
  return (
    <div className="p-4">
      <div className="border p-4 h-80 overflow-y-scroll">
        {messages.map((m, i) => (
          <p
            key={i}
            className={m.sender === user._id ? "text-right" : "text-left"}
          >
            {m.text}
          </p>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border flex-1 p-2"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-3">
          Send
        </button>
      </div>
    </div>
  );
}
