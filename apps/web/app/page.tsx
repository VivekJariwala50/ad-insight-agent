"use client";
import { useState, useRef, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChatMessage {
  role: "user" | "bot";
  content: string;
  chartData?: any[];
}

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // --- API HANDLERS ---
  const sendMessage = async () => {
    if (!input) return;
    const newMsg: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMsg]);
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: data.response, chartData: data.chartData },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "⚠️ Error: Backend is offline. Run 'npm start' in apps/api.",
        },
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const handleFileUpload = async () => {
    const newMsg: ChatMessage = {
      role: "user",
      content: "📄 [Uploaded: ad_creative_v1.png]",
    };
    setMessages((prev) => [...prev, newMsg]);
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:3001/api/analyze-image", {
        method: "POST",
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: data.response, chartData: [] },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white text-slate-900 font-sans overflow-hidden">
      {/* Sidebar Start */}
      <div className="w-72 bg-slate-950 text-white flex-col hidden md:flex border-r border-slate-800">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Ad Agent
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Marketing Intelligence v1.0
          </p>
        </div>

        <div className="flex-1 p-4 space-y-6">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Active Integrations
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/50 text-slate-300 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>{" "}
                Meta Ads
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/50 text-slate-300 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>{" "}
                TikTok Business
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Quick Actions
            </div>
            <button
              onClick={() => setInput("Check ROAS")}
              className="w-full text-left p-2 text-sm text-slate-300 hover:bg-slate-800 rounded transition"
            >
              📈 Check Performance
            </button>
            <button
              onClick={() => setInput("Analyze Spend")}
              className="w-full text-left p-2 text-sm text-slate-300 hover:bg-slate-800 rounded transition"
            >
              💰 Analyze Spend
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs">
              VJ
            </div>
            <div className="text-sm">
              <div className="font-medium">Vivek Jariwala</div>
              <div className="text-xs text-slate-500">Full Stack Engineer</div>
            </div>
          </div>
        </div>
      </div>
      {/* Sidebar End */}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50 relative">
        {/* Header */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
          <h2 className="font-semibold text-slate-700">
            Ad Performance Assistant
          </h2>
          <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            AI Online
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-2">
                <svg
                  className="w-8 h-8 text-slate-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <p>Ask about ROAS, Spend, or upload a creative.</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-4 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "bot" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  AI
                </div>
              )}

              <div className="max-w-[85%] md:max-w-2xl space-y-4">
                <div
                  className={`p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>

                {/* CHART CONTAINER */}
                {msg.chartData && msg.chartData.length > 0 && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Data Visualization
                      </h3>
                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">
                        Live Data
                      </span>
                    </div>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={msg.chartData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f1f5f9"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="campaign"
                            tick={{ fill: "#64748b", fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                          />
                          <YAxis
                            tick={{ fill: "#64748b", fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#fff",
                              borderRadius: "12px",
                              border: "1px solid #e2e8f0",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                            cursor={{ fill: "#f8fafc" }}
                          />
                          <Legend wrapperStyle={{ paddingTop: "20px" }} />
                          <Bar
                            dataKey="roas"
                            fill="#6366f1"
                            name="ROAS"
                            radius={[6, 6, 0, 0]}
                            barSize={40}
                            animationDuration={1500}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-600 text-xs font-bold">
                  You
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
                AI
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-slate-50/90 backdrop-blur-sm z-20">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.05)] border border-slate-200 p-2 flex items-center gap-2 relative transition-all focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300">
            <button
              onClick={handleFileUpload}
              className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors group relative"
              title="Upload Image for AI Analysis"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                />
              </svg>
            </button>

            <input
              className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400 text-base"
              placeholder="Ask about ROAS, Campaign Performance, or upload a creative..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
            />

            <button
              onClick={sendMessage}
              disabled={loading || !input}
              className={`p-3 rounded-xl transition-all duration-200 flex items-center justify-center ${
                input
                  ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </div>
          <div className="text-center mt-2">
            <p className="text-[10px] text-slate-400">
              AI can make mistakes. Verify important financial data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
