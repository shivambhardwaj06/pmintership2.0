import { useEffect, useRef, useState } from "react";
import { X, Send, User, Minus, ExternalLink, Sparkles, BookOpen } from "lucide-react";
import mascot from "@/assets/chatbot-mascot.png";

function Mascot({ className = "h-full w-full" }) {
  return (
    <img
      src={mascot}
      alt="Mascot"
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

const QUICK_PROMPTS = [
  "IIT Kanpur SURGE 2026",
  "IIT Roorkee SPARK stipend",
  "IIT Hyderabad SURE details",
  "Internships for CSE / AI",
  "DRDO & ISRO internships",
  "Tips to get selected",
];

// Offline verified knowledge cache as fallback if server is starting or network fails
function getVerifiedFallbackReply(text) {
  const t = text.toLowerCase();
  if (t.includes("surge") || t.includes("kanpur")) {
    return {
      answer:
        "**IIT Kanpur SURGE 2026 (Students Undergraduate Research Graduate Excellence)**\n\n" +
        "• **Eligibility:** Indian UG students (typically 2nd/3rd year), CPI >= ~6.0, IITK internal students, and limited seats for Nepal & Bhutan.\n" +
        "• **Stipend:** Depends on category (Institute-funded / Project-funded / Self-funded / SAARC).\n" +
        "• **Duration:** 11 May – 10 July 2026 (8 weeks, on-campus).\n" +
        "• **Deadline:** **22 February 2026**.\n" +
        "• **Application Portal:** [surge.iitk.ac.in](https://surge.iitk.ac.in/)",
      sources: [{ title: "IIT Kanpur SURGE 2026", page: 2, url: "https://surge.iitk.ac.in/" }],
    };
  }
  if (t.includes("spark") || t.includes("roorkee")) {
    return {
      answer:
        "**IIT Roorkee SPARK 2026**\n\n" +
        "• **Eligibility:** UG/PG students (B.Tech / B.E / BS-MS / B.Arch / M.Sc / MA) with min 2 semesters completed and 1 semester remaining.\n" +
        "• **CGPA Cut-offs:** IITs/IISc > 7.5; NITs/IISER > 8.0; Other colleges > 8.5.\n" +
        "• **Stipend:** **₹2,500 per week** for institute-funded slots + completion certificate.\n" +
        "• **Timeline:** Opens Mid-Feb 2026, Deadline March 2026. Internship May–July 2026.\n" +
        "• **Application Portal:** [spark.iitr.ac.in](https://spark.iitr.ac.in/)",
      sources: [{ title: "IIT Roorkee SPARK 2026", page: 3, url: "https://spark.iitr.ac.in/" }],
    };
  }
  if (t.includes("sure") || t.includes("hyderabad")) {
    return {
      answer:
        "**IIT Hyderabad SURE Program 2026**\n\n" +
        "• **Eligibility:** Non-IITH students. Top ~20% academic performers in UG.\n" +
        "• **Stipend:** Earlier cycles offered **~₹15,000 for ~2 months**.\n" +
        "• **Duration:** 1–2 months, full-time on-campus.\n" +
        "• **Portal:** Expected to go live Feb–Mar 2026 on the IIT Hyderabad official website.",
      sources: [{ title: "IIT Hyderabad SURE 2026", page: 4, url: "https://www.iith.ac.in/" }],
    };
  }
  if (t.includes("tip") || t.includes("chance") || t.includes("select")) {
    return {
      answer:
        "**Tips to Maximize Your Internship Selection Chances (Pages 5 & 28):**\n\n" +
        "1. **Project-specific SOP:** Never submit a generic statement. Tailor it to the professor's ongoing research.\n" +
        "2. **Faculty Shortlisting:** Review lab publications and reach out with informed questions.\n" +
        "3. **Apply Early:** Many competitive portals close once volume peaks.\n" +
        "4. **Keep Documents Ready:** Mark sheets, updated CV, and College NOC.\n" +
        "5. **Anti-Fraud Warning:** Never pay money or UPI transfers to 'secure' an internship. Official research internships never charge candidates.",
      sources: [{ title: "Tips to Increase Your Chances", page: 5, url: "" }],
    };
  }
  return {
    answer:
      "Namaste! I am the PM & IIT Summer Internship Assistant powered by the verified 2026 guide. Ask me about specific IIT programs (Kanpur SURGE, Roorkee SPARK, Hyderabad SURE, Goa, Delhi, Gandhinagar, Bhubaneswar) or 50+ research leads (DRDO, ISRO, Google, NVIDIA, BHEL)!",
    sources: [{ title: "IIT's Summer Internship Guide 2026", page: 1, url: "" }],
  };
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

function FormattedContent({ text }) {
  if (!text) return null;

  // Split lines
  const lines = text.split("\n");

  return (
    <div className="space-y-1 text-sm leading-relaxed">
      {lines.map((line, idx) => {
        if (!line.trim()) return <div key={idx} className="h-1.5" />;

        // Header lines starting with ### or **
        const isHeading = line.startsWith("### ") || line.startsWith("## ");
        const cleanLine = isHeading ? line.replace(/^#{2,3}\s*/, "") : line;

        // Process markdown bolding and URLs
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
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-0.5 font-medium text-primary underline underline-offset-2 hover:opacity-80"
              >
                {linkText}
                <ExternalLink className="inline h-3 w-3" />
              </a>
            );
          } else if (token.startsWith("http")) {
            parts.push(
              <a
                key={match.index}
                href={token}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-0.5 font-medium text-primary underline underline-offset-2 hover:opacity-80"
              >
                {token}
                <ExternalLink className="inline h-3 w-3" />
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
            <p key={idx} className="font-semibold text-primary pt-1">
              {parts}
            </p>
          );
        }

        if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1">
              <span className="text-primary/70 select-none">•</span>
              <span className="flex-1">{parts}</span>
            </div>
          );
        }

        return <p key={idx}>{parts}</p>;
      })}
    </div>
  );
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Namaste! I'm your PM & IIT Summer Internship Assistant. Ask me about IIT Kanpur SURGE, Roorkee SPARK, Hyderabad SURE, stipends, eligibility, or 50+ research leads from the 2026 guide!",
      sources: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [coldStartNotice, setColdStartNotice] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, coldStartNotice]);

  async function send(text) {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    // Add user message to UI
    const updatedMessages = [...messages, { role: "user", text: trimmed }];
    setMessages(updatedMessages);
    setInput("");
    setTyping(true);
    setColdStartNotice(false);

    // Render free tier notification timer: if response takes >3 seconds, notify user
    const noticeTimer = window.setTimeout(() => {
      setColdStartNotice(true);
    }, 3000);

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
          top_k: 5,
        }),
      });

      window.clearTimeout(noticeTimer);
      setColdStartNotice(false);

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
      window.clearTimeout(noticeTimer);
      setColdStartNotice(false);
      console.warn("Backend connection issue, serving grounded offline fallback:", err);

      // Fallback seamlessly using verified local guide cache
      const fallback = getVerifiedFallbackReply(trimmed);
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: fallback.answer,
          sources: fallback.sources,
          isFallback: true,
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
        aria-label="PM & IIT Internship Assistant"
        aria-hidden={!open}
        className={`fixed bottom-24 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all duration-300 sm:right-6 ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-4 scale-95 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 bg-primary px-4 py-3 text-primary-foreground">
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-saffron/90 p-1">
            <Mascot className="h-8 w-8" />
            <span
              className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-primary bg-green-500"
              aria-hidden="true"
            />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="font-display text-sm font-semibold">IIT & PM Internship AI</p>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-saffron/20 px-1.5 py-0.2 text-[10px] font-medium text-saffron-foreground border border-saffron/30">
                <Sparkles className="h-2.5 w-2.5 text-yellow-300" /> RAG Nemotron
              </span>
            </div>
            <p className="text-xs text-primary-foreground/70">Verified 2026 Guide · 101+ Opportunities</p>
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
        <div ref={listRef} className="flex h-96 flex-col gap-3 overflow-y-auto bg-muted/40 px-4 py-4">
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
                className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm ${
                  m.role === "user"
                    ? "rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-bl-sm bg-card text-card-foreground shadow-sm border border-border/50"
                }`}
              >
                <FormattedContent text={m.text} />

                {/* Sources & Citations */}
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-border/60">
                    <p className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1 mb-1.5">
                      <BookOpen className="h-3 w-3 text-primary" /> Verified Sources:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {m.sources.map((s, sIdx) => (
                        <span
                          key={sIdx}
                          className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground border border-border"
                          title={s.title}
                        >
                          {s.page ? `Page ${s.page}` : "Guide"} •{" "}
                          <span className="font-medium text-foreground truncate max-w-[120px]">
                            {s.title.replace(/^#\d+\.\s*/, "")}
                          </span>
                          {s.url && (
                            <a
                              href={s.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary hover:underline ml-0.5"
                            >
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Render cold start notice */}
          {coldStartNotice && (
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
              ⚡ <em>Connecting to RAG service on Render. First cold start can take ~30s on free hosting...</em>
            </div>
          )}

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

        {/* Quick prompts */}
        <div className="flex gap-1.5 overflow-x-auto border-t border-border bg-card px-3 py-2 scrollbar-none">
          {QUICK_PROMPTS.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="shrink-0 rounded-full border border-primary/25 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
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
            placeholder="Ask about IIT internships, stipends, leads…"
            aria-label="Ask about IIT internships"
            className="min-w-0 flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
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
        aria-label={open ? "Close chat assistant" : "Open chat assistant"}
        aria-expanded={open}
        className="group fixed bottom-5 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-all hover:scale-105 sm:right-6"
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
