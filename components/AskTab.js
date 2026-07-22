"use client";

import { useState, useRef, useEffect } from "react";

export default function AskTab() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "Assalam-o-Alaikum! I'm your Farm Assistant. Ask me anything about crops, irrigation, soil, or pests. \n\nUrdu summary: Mujhse fasal, paani, mitti ya keeron ke baare mein kuch bhi poochein.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  async function send() {
    const question = input.trim();
    if (!question || loading) return;

    const newMessages = [...messages, { role: "user", text: question }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          history: newMessages.slice(0, -1),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages((m) => [...m, { role: "assistant", text: data.error || "Something went wrong." }]);
      } else {
        setMessages((m) => [...m, { role: "assistant", text: data.answer }]);
      }
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "Could not reach the AI service. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="card">
      <h2>💬 Farm Assistant</h2>
      <p className="muted">Ask a farming question anytime — irrigation, pests, soil, best practices.</p>

      <div className="chat-window" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.role}`}>
            {m.text}
          </div>
        ))}
        {loading && <div className="chat-bubble assistant"><span className="spinner" />Thinking...</div>}
      </div>

      <div className="chat-input-row">
        <textarea
          rows={2}
          placeholder="e.g. When should I irrigate wheat after sowing?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn" onClick={send} disabled={loading || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}
