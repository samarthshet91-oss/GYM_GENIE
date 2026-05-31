import { Bot, Dumbbell, Flame, Salad, SendHorizonal, Sparkles } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import BrandMark from "../components/BrandMark";
import GlassCard from "../components/GlassCard";
import SecondaryHeader from "../components/SecondaryHeader";
import { apiRequest } from "../services/api";

const prompts = ["Plan my workout", "Fix my diet", "Motivate me"];

const responseCards = [
  {
    title: "Workout plan",
    text: "Build a focused session",
    prompt: "Create a workout plan for today with warmup, main exercises, sets, reps, and cooldown.",
    icon: Dumbbell,
    glow: "from-cyan-300/18 to-emerald-300/10"
  },
  {
    title: "Diet plan",
    text: "Clean meals and macros",
    prompt: "Create a simple diet plan for today with breakfast, lunch, dinner, snacks, and hydration tips.",
    icon: Salad,
    glow: "from-emerald-300/18 to-lime-300/10"
  },
  {
    title: "Motivation",
    text: "Get a quick push",
    prompt: "Motivate me to stay consistent with fitness today in a practical and energetic way.",
    icon: Flame,
    glow: "from-cyan-300/14 to-orange-300/10"
  }
];

function safeText(value, fallback = "") {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "string" || typeof value === "number") return value;
  return fallback;
}

function formatCoachReply(text) {
  const clean = safeText(text, "Message unavailable.").trim();
  const hasMarkdownStructure = /(^#{1,3}\s)|(^[-*]\s)|(\n[-*]\s)|(\*\*.+\*\*)/m.test(clean);

  if (hasMarkdownStructure) {
    return clean;
  }

  return `### ⚡ Coach Response

**Workout**
- ${clean}

**Diet**
- Keep protein high, hydrate well, and choose simple meals you can repeat.

**Tips**
- Start small, keep your form clean, and finish the session you planned.

**Warning**
- Stop if you feel sharp pain, dizziness, or unusual discomfort.

**Finish strong**
- One disciplined rep today makes tomorrow easier.`;
}

function CoachMarkdown({ children }) {
  return (
    <ReactMarkdown
      components={{
        h3: ({ children: heading }) => <h3 className="mb-3 font-display text-lg font-bold text-cyan-200 light:text-cyan-700">{heading}</h3>,
        p: ({ children: paragraph }) => <p className="mb-3 text-sm leading-6 last:mb-0">{paragraph}</p>,
        strong: ({ children: strong }) => <strong className="font-extrabold text-emerald-200 light:text-emerald-700">{strong}</strong>,
        ul: ({ children: list }) => <ul className="mb-3 space-y-2">{list}</ul>,
        li: ({ children: item }) => <li className="flex gap-2 text-sm leading-6 before:mt-2 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-cyan-300">{item}</li>
      }}
    >
      {children}
    </ReactMarkdown>
  );
}

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

      setMessages((previous) => [...previous, { role: "coach", text: safeText(data.reply, "I am ready to help. Try asking about training, food, or recovery.") }]);
    } catch (error) {
      setMessages((previous) => [...previous, { role: "coach", text: error.message }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-132px)] flex-col">
      <div className="pointer-events-none absolute -right-24 top-24 h-56 w-56 rounded-full bg-cyan-300/14 blur-[100px]" />
      <SecondaryHeader title="AI Coach" icon={Bot} />
      <div className="mb-4">
        <p className="text-sm font-bold text-cyan-300">AI Coach</p>
        <h1 className="mt-1 font-display text-[32px] leading-none">Coach Chat</h1>
        <p className="mt-2 text-sm text-muted">Premium guidance for workouts, meals, and momentum.</p>
      </div>

      <GlassCard className="relative mb-4 overflow-hidden rounded-[30px] p-4" hover={false}>
        <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-emerald-300/20 blur-[70px]" />
        <div className="flex items-center gap-3">
          <BrandMark small className="h-12 w-12 rounded-2xl shadow-[0_0_28px_rgba(34,211,238,.24)]" />
          <div>
            <p className="font-display text-xl">GymGenie AI</p>
            <p className="text-xs text-muted">Online and ready</p>
          </div>
        </div>
      </GlassCard>

      <div className="mb-4 grid grid-cols-3 gap-2">
        {responseCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.title}
              type="button"
              onClick={(event) => sendMessage(event, card.prompt)}
              className="glass-card relative min-h-[104px] overflow-hidden rounded-[24px] p-3 text-left transition hover:-translate-y-0.5"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.glow}`} />
              <div className="relative">
                <div className="mb-3 grid h-9 w-9 place-items-center rounded-2xl bg-white/5 text-cyan-300 light:bg-cyan-50 light:text-cyan-700">
                  <Icon size={17} />
                </div>
                <p className="text-xs font-extrabold">{card.title}</p>
                <p className="mt-1 text-[10px] leading-4 text-muted">{card.text}</p>
              </div>
            </button>
          );
        })}
      </div>

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

      <div className="hide-scrollbar flex-1 space-y-4 overflow-y-auto">
        {messages.map((item, index) => (
          <div key={`${item.role}-${index}`} className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}>
            {item.role === "coach" ? (
              <div className="max-w-[92%]">
                <div className="mb-2 flex items-center gap-2 pl-1">
                  <BrandMark small className="h-8 w-8 rounded-xl shadow-[0_0_20px_rgba(34,211,238,.24)]" />
                  <div>
                    <p className="text-xs font-extrabold">GymGenie AI</p>
                    <p className="text-[10px] text-muted">AI fitness coach</p>
                  </div>
                </div>
                <div className="glass-card rounded-[28px] p-4 text-sm leading-6 text-slate-100 shadow-[0_18px_44px_rgba(0,0,0,.24)] light:text-slate-900">
                  <CoachMarkdown>{formatCoachReply(item.text)}</CoachMarkdown>
                </div>
              </div>
            ) : (
              <div className="max-w-[86%] rounded-[26px] bg-gradient-to-br from-cyan-300 to-emerald-300 px-4 py-3 text-sm font-semibold leading-6 text-slate-950 shadow-[0_16px_34px_rgba(34,211,238,.18)]">
                {safeText(item.text, "Message unavailable.")}
              </div>
            )}
          </div>
        ))}
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted">
            <BrandMark small className="h-7 w-7 rounded-lg" />
            <span>Coach is thinking...</span>
          </div>
        ) : null}
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
