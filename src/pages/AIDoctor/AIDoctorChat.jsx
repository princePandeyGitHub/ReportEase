import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function AIDoctorChat() {
  const [messages, setMessages] = useState([
    { from: "ai", text: "Hello, how can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;

    setMessages((prev) => [...prev, { from: "user", text: trimmed }]);
    setInput("");
    setIsThinking(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/chat`,
        { message: trimmed },
        { withCredentials: true }
      );
      setMessages((prev) => [...prev, { from: "ai", text: response.data.reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "Sorry, I couldn't process that right now. Please try again." }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-teal-50 p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white shadow">
              <span className="text-lg font-semibold">AI</span>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                AI Doctor
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Your health chat assistant</h2>
            </div>
          </div>
          <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Online & ready
          </div>
        </div>

        <div className="mt-5 flex h-[520px] flex-col">
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 ${
                    m.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {m.from === "ai" && (
                    <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-white text-teal-600 shadow-sm">
                      <span className="text-xs font-semibold">AI</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      m.from === "user"
                        ? "bg-teal-600 text-white"
                        : "bg-white text-slate-700"
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.from === "user" && (
                    <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm">
                      <span className="text-xs font-semibold">You</span>
                    </div>
                  )}
                </div>
              ))}

              {isThinking && (
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-white text-teal-600 shadow-sm">
                    <span className="text-xs font-semibold">AI</span>
                  </div>
                  <div className="max-w-[70%] rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Thinking
                      </span>
                      <span className="flex gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-500 [animation-delay:-0.2s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-500 [animation-delay:-0.1s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-500" />
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                placeholder="Ask the AI doctor about your health..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <button
                onClick={sendMessage}
                disabled={isThinking}
                className="rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Send
              </button>
            </div>
            <div className="mt-2 text-xs text-slate-400">
              This assistant provides general guidance only and is not a substitute for professional care.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
