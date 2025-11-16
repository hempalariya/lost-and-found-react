import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { socket } from "../../utils/socket";
import axios from "../../utils/api";

export default function ChatRoom() {
  const { id: reportId } = useParams();
  const { user: currentUser, token } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const markConversationRead = useCallback(() => {
    if (!reportId || !token) return;
    axios
      .post(
        `/chat/${reportId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .catch(() => {});
  }, [reportId, token]);

  useEffect(() => {
    if (!reportId || !token) {
      setMessages([]);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError("");
    setMessages([]);

    axios
      .get(`/chat/${reportId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        if (isMounted) {
          setMessages(data);
          markConversationRead();
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err.response?.data?.message || "Unable to load conversation right now"
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [markConversationRead, reportId, token]);

  useEffect(() => {
    if (!reportId || !token) return;

    const handleIncomingMessage = (incoming) => {
      if (incoming.reportId !== reportId) return;
      setMessages((prev) => {
        const exists = prev.some((msg) => msg._id === incoming._id);
        return exists ? prev : [...prev, incoming];
      });
      markConversationRead();
    };

    socket.emit("join_room", reportId);
    socket.on("receive_message", handleIncomingMessage);

    return () => {
      socket.emit("leave_room", reportId);
      socket.off("receive_message", handleIncomingMessage);
    };
  }, [markConversationRead, reportId, token]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  if (!currentUser || !token) {
    return (
      <div className="p-6 text-center">
        <p className="mb-4 text-lg font-semibold">
          Please log in to chat with the item owner.
        </p>
        <Link className="text-blue-600 underline" to="/login">
          Go to login
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !token) return;

    try {
      setError("");
      const { data } = await axios.post(
        `/chat/${reportId}`,
        { text: trimmed },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages((prev) => {
        const exists = prev.some((msg) => msg._id === data._id);
        return exists ? prev : [...prev, data];
      });
      setText("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to send message");
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Chat about this item</h1>
      <div
        ref={scrollRef}
        className="border rounded p-4 h-96 overflow-y-auto bg-gray-50"
      >
        {loading && <p className="text-gray-500">Loading messages...</p>}
        {!loading && messages.length === 0 && (
          <p className="text-gray-500">No messages yet. Be the first to reach out.</p>
        )}
        {messages.map((message) => {
          const isMine = message.sender === currentUser?._id;
          return (
            <div
              key={message._id}
              className={`mb-3 flex ${
                isMine ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs md:max-w-md ${
                  isMine ? "bg-blue-500 text-white" : "bg-white border"
                }`}
              >
                <p className="text-xs opacity-70 mb-1">
                  {isMine ? "You" : message.senderName || "Unknown user"}
                </p>
                <p>{message.text}</p>
              </div>
            </div>
          );
        })}
      </div>
      {error && <p className="text-red-500 mt-3">{error}</p>}
      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border flex-1 p-2 rounded"
          placeholder="Write your message..."
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
