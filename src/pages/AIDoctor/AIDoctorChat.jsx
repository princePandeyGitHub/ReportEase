import { useState } from "react";

export default function AIDoctorChat() {
  const [messages, setMessages] = useState([
    { from: "ai", text: "Hello, how can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input) return;
    setMessages([...messages, { from: "user", text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages(m => [...m, { from: "ai", text: "I am analyzing your concern." }]);
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto h-130 bg-white p-4 rounded shadow flex flex-col">
      {/* Messages section grows to take available space */}
      <div className="flex-1 overflow-y-auto mb-3 space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={m.from === "user" ? "text-right" : "text-left"}>
            <span className="inline-block px-3 py-2 rounded bg-slate-200 ">
              {m.text}
            </span>
          </div>
        ))}
      </div>

      {/* Input section pinned at the bottom */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Ask the AI doctor..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button
          onClick={sendMessage}
          className="bg-teal-600 text-white px-4 rounded cursor-pointer hover:bg-teal-400"
        >
          Send
        </button>
      </div>
    </div>
  );
}
