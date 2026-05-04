import { Bot, Dumbbell, Salad, SendHorizonal, Sparkles } from "lucide-react";
import { useState } from "react";
import GlassCard from "../components/GlassCard";
import { apiRequest } from "../services/api";

const prompts = ["Plan my workout", "Fix my diet", "Motivate me"];

export default function Coach() {
  const [messages, setMessages] = useState([
    { role: "coach", text: "Ask me about training, food, recovery, or how to stay consistent this week." }
  ]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(event, quickPrompt) {
    event?.preventDefault();
    const outgoing = quickPrompt || message;

    if (!outgoing.trim()) return;

    setMessages((previous) => [...previous, { role: "user", text: outgoing }]);
    setMessage("");
    setLoading(true);

    try {
      const data = await apiRequest("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: outgoing })
      });

      setMessages((previous) => [...previous, { role: "coach", text: data.reply }]);
    } catch (error) {
      setMessages((previous) => [...previous, { role: "coach", text: error.message }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-132px)] flex-col">
      <div className="mb-4">
        <p className="text-sm font-bold text-cyan-300">AI Coach</p>
        <h1 className="mt-1 font-display text-[32px] leading-none">Coach Chat</h1>
        <p className="mt-2 text-sm text-muted">Premium guidance for workouts, meals, and momentum.</p>
      </div>

      <GlassCard className="mb-4 p-4" hover={false}>
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-emerald-300 text-slate-950">
            <Bot size={24} />
          </div>
          <div>
            <p className="font-display text-xl">GymGenie AI</p>
            <p className="text-xs text-muted">Online and ready</p>
          </div>
        </div>
      </GlassCard>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {prompts.map((prompt, index) => {
          const Icon = [Dumbbell, Salad, Sparkles][index];
          return (
            <button key={prompt} type="button" onClick={(event) => sendMessage(event, prompt)} className="soft-btn flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-bold">
              <Icon size={14} />
              {prompt}
            </button>
          );
        })}
      </div>

      <div className="hide-scrollbar flex-1 space-y-3 overflow-y-auto">
        {messages.map((item, index) => (
          <div key={`${item.role}-${index}`} className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[86%] rounded-[26px] px-4 py-3 text-sm leading-6 shadow-lg ${
              item.role === "user"
                ? "bg-gradient-to-br from-cyan-300 to-emerald-300 text-slate-950"
                : "glass-card text-slate-100 light:text-slate-900"
            }`}>
              {item.role === "coach" ? <Bot className="mb-2 text-cyan-300" size={16} /> : null}
              {item.text}
            </div>
          </div>
        ))}
        {loading ? <p className="text-sm text-muted">Coach is thinking...</p> : null}
      </div>

      <form onSubmit={sendMessage} className="mt-4 flex items-center gap-3">
        <input value={message} onChange={(event) => setMessage(event.target.value)} className="input-shell min-w-0 flex-1 rounded-[24px] px-4 py-4 outline-none" placeholder="Ask your AI coach" />
        <button type="submit" className="neon-button grid h-14 w-14 place-items-center rounded-[22px]" aria-label="Send">
          <SendHorizonal size={18} />
        </button>
      </form>
    </div>
  );
}
