import { useEffect, useRef, useState } from "react";
import { X, Send, User, Minus, ExternalLink, Sparkles } from "lucide-react";
import mascot from "@/assets/chatbot-mascot.png";

function Mascot({ className = "h-full w-full" }) {
  return (
    <img
      src={mascot}
      alt="Disha Mascot"
      width={816}
      height={816}
      loading="lazy"
      className={`${className} object-contain`}
      aria-hidden="true"
    />
  );
}

const RAW_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const BACKEND_URL = RAW_BACKEND_URL.replace(/\/+$/, "");

// Exact 3 default questions requested by user:
const QUICK_PROMPTS = [
  "Audit my resume & match jobs",
  "See past selected resume",
  "Ask about an internship",
];

// Offline verified guidance replies for instant response
function getDishaGroundedReply(text) {
  const t = text.toLowerCase();

  if (t.includes("audit") || t.includes("match") || t.includes("resume") || t.includes("ats")) {
    return {
      answer:
        "Namaste! Our **AI Resume Recruiter Engine** audits your 1-page corporate resume and matches top roles directly from MongoDB.\n\n" +
        "• **How to use it:** Open your **Student Dashboard** -> Upload your 1-page PDF resume.\n" +
        "• It will instantly evaluate ATS compliance, extract your verified skills, and return your **Top 5 Database Matched Roles** from 260 official openings!\n\n" +
        "👉 *Navigate to your Student Dashboard to audit your resume now!*",
      sources: [{ title: "Student Dashboard • Resume Audit", url: "#dashboard" }],
    };
  }

  if (t.includes("past selected resume") || t.includes("past selection") || t.includes("resume") || t.includes("interview video") || t.includes("cv")) {
    return {
      answer:
        "Namaste! You can review real winning resumes and corporate interview rounds in our **Learn from Past Selection** hub:\n\n" +
        "• Curated resume blueprints and interview preparation locked directly to your academic branch.\n" +
        "• Watch domain-specific mock interview videos and learn key interview questions with winning answers.\n\n" +
        "👉 *Navigate to **Student Dashboard -> Learn from Past Selection** to view your branch's blueprint and interview guide!*",
      sources: [{ title: "Student Dashboard • Learn from Past Selection", url: "#resumes" }],
    };
  }

  if (t.includes("ask about an internship") || t.includes("internship") || t.includes("available")) {
    return {
      answer:
        "We have **paid corporate internships across 24 sectors** right now!\n\n" +
        "• **Stipends:** ₹8,000–₹15,000/month (sample prototype listings).\n" +
        "• **Modes:** Hybrid, On-site, and Remote options in Karnataka, Maharashtra, Tamil Nadu, Delhi/NCR, and Pan-India.\n" +
        "• **Top Companies:** TCS, Infosys, HDFC, Maruti Suzuki, Tata Motors, L&T, Sun Pharma, NTPC, etc.\n\n" +
        "👉 *Scroll to our **Explore Internships** section to filter by your State, Mode, and Sector!*",
      sources: [{ title: "Explore Internships Section", url: "#explore-internships" }],
    };
  }

  if (t.includes("apply") || t.includes("how to")) {
    return {
      answer:
        "Applying is simple and 100% student-friendly on our portal:\n\n" +
        "1. Click **'Login / Register'** in the top navigation bar to create your account.\n" +
        "2. Complete your **Branch, Career Goals, and Resume** in the Student Dashboard.\n" +
        "3. Go to **Explore Internships**, pick your matching role, and click **'Apply Now'**!\n\n" +
        "👉 *You can track your applications anytime in your dashboard.*",
      sources: [{ title: "Portal Application Guide", url: "#explore-internships" }],
    };
  }

  return {
    answer:
      "Namaste! I am **Disha**, your friendly PM Internship AI Guide.\n\n" +
      "I can help you explore corporate internships across 24 sectors, analyze your skill gaps, and share winning resume formats. Try asking one of the quick questions below!",
    sources: [{ title: "PM Internship Scheme (PMIS)", url: "" }],
  };
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 px-1 py-1.5" aria-label="Disha is typing">
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

function FormattedContent({ text }) {
  if (!text) return null;
  const lines = text.split("\n");

  return (
    <div className="space-y-1 text-xs sm:text-sm leading-relaxed">
      {lines.map((line, idx) => {
        if (!line.trim()) return <div key={idx} className="h-1" />;

        const isHeading = line.startsWith("### ") || line.startsWith("## ");
        const cleanLine = isHeading ? line.replace(/^#{2,3}\s*/, "") : line;

        const parts = [];
        const regex = /(\*\*.*?\*\*|https?:\/\/[^\s]+|\[.*?\]\(.*?\))/g;
        let lastIdx = 0;
        let match;

        while ((match = regex.exec(cleanLine)) !== null) {
          if (match.index > lastIdx) {
            parts.push(cleanLine.substring(lastIdx, match.index));
          }
          const token = match[0];

          if (token.startsWith("**") && token.endsWith("**")) {
            parts.push(
              <strong key={match.index} className="font-semibold text-foreground">
                {token.slice(2, -2)}
              </strong>
            );
          } else if (token.startsWith("[") && token.includes("](") && token.endsWith(")")) {
            const linkText = token.slice(1, token.indexOf("]("));
            const linkUrl = token.slice(token.indexOf("](") + 2, -1);
            parts.push(
              <a
                key={match.index}
                href={linkUrl}
                className="inline-flex items-center gap-0.5 font-bold text-primary underline underline-offset-2 hover:opacity-80"
              >
                {linkText}
                <ExternalLink className="inline h-2.5 w-2.5" />
              </a>
            );
          } else if (token.startsWith("http")) {
            parts.push(
              <a
                key={match.index}
                href={token}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-0.5 font-bold text-primary underline underline-offset-2 hover:opacity-80"
              >
                {token}
                <ExternalLink className="inline h-2.5 w-2.5" />
              </a>
            );
          }
          lastIdx = regex.lastIndex;
        }

        if (lastIdx < cleanLine.length) {
          parts.push(cleanLine.substring(lastIdx));
        }

        if (isHeading) {
          return (
            <p key={idx} className="font-bold text-primary pt-0.5">
              {parts}
            </p>
          );
        }

        if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1">
              <span className="text-primary/70 select-none font-bold">•</span>
              <span className="flex-1">{parts}</span>
            </div>
          );
        }

        return <p key={idx}>{parts}</p>;
      })}
    </div>
  );
}

export default function Chatbot({ onNavigateTab }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Namaste! I am **Disha**, your friendly PM Internship AI Guide.\n\nAsk me about corporate internships across 24 sectors, analyzing your skill gaps, or reviewing winning resumes!",
      sources: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener("open-disha", handleOpen);
    return () => window.removeEventListener("open-disha", handleOpen);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  async function send(text) {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setInput("");
    setTyping(true);

    try {
      const historyPayload = messages.slice(-4).map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: historyPayload,
          top_k: 4,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((m) => [
          ...m,
          {
            role: "bot",
            text: data.answer || "No response received.",
            sources: data.sources || [],
          },
        ]);
      } else {
        throw new Error(`Server returned status ${res.status}`);
      }
    } catch (err) {
      // Fast friendly grounded fallback
      const fallback = getDishaGroundedReply(trimmed);
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: fallback.answer,
          sources: fallback.sources,
        },
      ]);
    } finally {
      setTyping(false);
      inputRef.current?.focus();
    }
  }

  return (
    <>
      {/* Chat panel */}
      <div
        role="dialog"
        aria-label="Disha PM Internship Guide"
        aria-hidden={!open}
        className={`fixed bottom-24 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-md flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl transition-all duration-300 sm:right-6 ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-4 scale-95 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-primary to-primary/95 px-4 py-3.5 text-primary-foreground shadow-md">
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-saffron/90 p-1 shadow-inner">
            <Mascot className="h-8 w-8" />
            <span
              className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-primary bg-green-500"
              aria-hidden="true"
            />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="font-display text-base font-bold text-white tracking-tight">Disha</p>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-saffron/20 px-2 py-0.2 text-[10px] font-bold text-saffron-foreground border border-saffron/40">
                <Sparkles className="h-2.5 w-2.5 text-yellow-300" /> Student AI Guide
              </span>
            </div>
            <p className="text-[11px] text-primary-foreground/75">PM Internship Scheme · Official Portal</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-full p-1.5 transition-colors hover:bg-primary-foreground/10 text-primary-foreground"
            aria-label="Minimize chat"
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            onClick={() => setOpen(false)}
            className="rounded-full p-1.5 transition-colors hover:bg-primary-foreground/10 text-primary-foreground"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Messages list */}
        <div ref={listRef} className="flex h-96 flex-col gap-3 overflow-y-auto bg-muted/30 px-4 py-4">
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

              <div
                className={`max-w-[84%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm ${
                  m.role === "user"
                    ? "rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-bl-sm bg-card text-card-foreground shadow-sm border border-border/60"
                }`}
              >
                <FormattedContent text={m.text} />
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex items-end gap-2">
              <span
                className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-saffron p-0.5"
                aria-hidden="true"
              >
                <Mascot className="h-6 w-6" />
              </span>
              <span className="rounded-2xl rounded-bl-sm bg-card shadow-sm border border-border/50 px-3 py-1">
                <TypingDots />
              </span>
            </div>
          )}
        </div>

        {/* User-requested exact 3 quick prompts */}
        <div className="flex gap-1.5 overflow-x-auto border-t border-border bg-card px-3 py-2 scrollbar-none">
          {QUICK_PROMPTS.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="shrink-0 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground whitespace-nowrap active:scale-95 shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input form */}
        <form
          className="flex items-center gap-2 border-t border-border bg-card px-3 py-2.5"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Disha about internships, skills, or guidelines…"
            aria-label="Ask Disha"
            className="min-w-0 flex-1 rounded-full border border-input bg-background px-4 py-2 text-xs sm:text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            disabled={!input.trim() || typing}
            aria-label="Send message"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-40"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
      </div>

      {/* Floating launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close Disha assistant" : "Ask Disha"}
        aria-expanded={open}
        className="group fixed bottom-5 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-primary/90 text-primary-foreground shadow-2xl transition-all hover:scale-105 sm:right-6 border-2 border-white/40"
      >
        <span
          className={`absolute inset-0 rounded-full bg-primary/40 ${open ? "" : "animate-ping"}`}
          style={open ? {} : { animationDuration: "2.5s" }}
          aria-hidden="true"
        />
        <span
          className={`relative flex items-center justify-center transition-transform duration-300 ${
            open ? "" : "chatbot-bob"
          }`}
        >
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
