import { useEffect, useRef, useState } from "react";
import { X, Send, User, Minus } from "lucide-react";
import mascot from "@/assets/chatbot-mascot.png";

function Mascot({ className = "h-full w-full" }) {
  return (
    <img
      src={mascot}
      alt=""
      width={816}
      height={816}
      loading="lazy"
      className={`${className} object-contain`}
      aria-hidden="true"
    />
  );
}

const QUICK_PROMPTS = [
  "Am I eligible?",
  "How do I apply?",
  "What is the stipend?",
  "Important dates",
];

// Placeholder replies until the real backend is connected.
function getBotReply(text) {
  const t = text.toLowerCase();
  if (t.includes("eligib"))
    return "To be eligible for PMIS, you should be an Indian citizen aged 21–24, not in full-time employment, and have completed at least Class 10. Would you like to check your eligibility in detail?";
  if (t.includes("apply") || t.includes("register"))
    return "You can apply through the Register button at the top of this page. Keep your Aadhaar and educational documents handy. The process takes about 10 minutes.";
  if (t.includes("stipend") || t.includes("salary") || t.includes("pay"))
    return "Interns receive a monthly stipend of ₹5,000 (₹4,500 from the Government via DBT and ₹500 from the company), plus a one-time grant of ₹6,000.";
  if (t.includes("date") || t.includes("deadline"))
    return "Application windows open in rounds throughout the year. Check the Featured Internships section above for the last date to apply for each opportunity.";
  return "Thanks for your question! I'm currently running in preview mode — once connected to the live assistant, I'll give you detailed answers about the PM Internship Scheme. Try one of the quick questions below.";
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 px-1 py-1.5" aria-label="Assistant is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </span>
  );
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Namaste! I'm the PM Internship assistant. Ask me about eligibility, applications, stipend or important dates.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function send(text) {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setInput("");
    setTyping(true);
    // Simulated reply — replaced by the real backend later.
    window.setTimeout(() => {
      setMessages((m) => [...m, { role: "bot", text: getBotReply(trimmed) }]);
      setTyping(false);
      inputRef.current?.focus();
    }, 900);
  }

  return (
    <>
      {/* Chat panel */}
      <div
        role="dialog"
        aria-label="PM Internship assistant"
        aria-hidden={!open}
        className={`fixed bottom-24 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all duration-300 sm:right-6 ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-4 scale-95 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 bg-primary px-4 py-3 text-primary-foreground">
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-saffron/90 p-1">
            <Mascot className="h-8 w-8" />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-primary bg-green-500" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-semibold">PM Internship Assistant</p>
            <p className="text-xs text-primary-foreground/70">Online · replies instantly</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-full p-1.5 transition-colors hover:bg-primary-foreground/10"
            aria-label="Minimize chat"
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            onClick={() => setOpen(false)}
            className="rounded-full p-1.5 transition-colors hover:bg-primary-foreground/10"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Messages */}
        <div ref={listRef} className="flex h-80 flex-col gap-3 overflow-y-auto bg-muted/40 px-4 py-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex items-end gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}
              style={{ animation: "chat-pop 0.25s ease-out" }}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  m.role === "user" ? "bg-primary text-primary-foreground" : "bg-saffron text-primary"
                }`}
                aria-hidden="true"
              >
                {m.role === "user" ? <User className="h-3.5 w-3.5" /> : <Mascot className="h-6 w-6" />}
              </span>
              <p
                className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-bl-sm bg-card text-card-foreground shadow-sm"
                }`}
              >
                {m.text}
              </p>
            </div>
          ))}
          {typing && (
            <div className="flex items-end gap-2">
              <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-saffron p-0.5" aria-hidden="true">
                <Mascot className="h-6 w-6" />
              </span>
              <span className="rounded-2xl rounded-bl-sm bg-card shadow-sm">
                <TypingDots />
              </span>
            </div>
          )}
        </div>

        {/* Quick prompts */}
        <div className="flex gap-2 overflow-x-auto border-t border-border bg-card px-4 py-2.5">
          {QUICK_PROMPTS.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="shrink-0 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <form
          className="flex items-center gap-2 border-t border-border bg-card px-3 py-3"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question…"
            aria-label="Type your question"
            className="min-w-0 flex-1 rounded-full border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            disabled={!input.trim() || typing}
            aria-label="Send message"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-40"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
      </div>

      {/* Floating launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat assistant" : "Open chat assistant"}
        aria-expanded={open}
        className="group fixed bottom-5 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-all hover:scale-105 sm:right-6"
      >
        {/* pulse ring */}
        <span
          className={`absolute inset-0 rounded-full bg-primary/40 ${open ? "" : "animate-ping"}`}
          style={open ? {} : { animationDuration: "2.5s" }}
          aria-hidden="true"
        />
        <span className={`relative flex items-center justify-center transition-transform duration-300 ${open ? "" : "chatbot-bob"}`}>
          {open ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Mascot className="h-11 w-11 rounded-full bg-saffron/20 p-0.5 transition-transform duration-300 group-hover:scale-110" />
          )}
        </span>
      </button>

      <style>{`
        @keyframes chat-pop {
          from { opacity: 0; transform: translateY(6px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chatbot-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .chatbot-bob { animation: chatbot-bob 2.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .animate-ping, .animate-bounce, .chatbot-bob { animation: none !important; }
        }
      `}</style>
    </>
  );
}
