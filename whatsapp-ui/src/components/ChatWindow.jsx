import React, { useState, useRef } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [options, setOptions] = useState([]);
  const userIdRef = useRef(uuidv4());  // stays the same across renders
  const userId = userIdRef.current;
  const flowId = 17;

  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;

    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
    setInput("");
    setOptions([]);

    try {
      const res = await axios.post(`http://localhost:5000/api/flows/${flowId}/run`, {
        userId,
        message: userMessage,
      });

      const botMessage = res.data.reply || "No response.";
      setMessages((prev) => [...prev, { from: "bot", text: botMessage }]);

      if (botMessage.toLowerCase().includes("yes") || botMessage.toLowerCase().includes("no")) {
        setOptions(["Yes", "No"]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { from: "bot", text: "Error: Could not contact flow." }]);
    }
  };

  const handleSend = () => sendMessage(input);
  const handleOptionClick = (opt) => sendMessage(opt);

  return (
    <div style={{ width: "400px", margin: "auto", border: "1px solid #ddd", borderRadius: "8px", padding: "16px" }}>
      <div style={{ height: "300px", overflowY: "auto", marginBottom: "12px", background: "#f9f9f9", padding: "8px" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.from === "user" ? "right" : "left" }}>
            <p
              style={{
                display: "inline-block",
                padding: "8px",
                borderRadius: "8px",
                background: msg.from === "user" ? "#007bff" : "#e4e6eb",
                color: msg.from === "user" ? "#fff" : "#000",
                maxWidth: "70%",
              }}
            >
              {msg.text}
            </p>
          </div>
        ))}
      </div>

      {options.length > 0 && (
        <div style={{ marginBottom: "8px", textAlign: "center" }}>
          {options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionClick(opt)}
              style={{
                margin: "0 4px",
                padding: "6px 12px",
                background: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          style={{ flex: 1, padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          placeholder="Type a message..."
        />
        <button onClick={handleSend} style={{ marginLeft: "8px", padding: "8px 16px" }}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
