import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, X } from "lucide-react";
import { useSendChatMessage } from "@workspace/api-client-react";
import type { ChatHistoryItem } from "@workspace/api-client-react";
import logoFull from "../assets/logo.png";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const SAMPLES = [
  "How does recovery work during a storm?",
  "What systems does dCortex connect to?",
  "How are crew legality issues handled?",
  "What does a typical deployment look like?",
];

const sparkleBox: React.CSSProperties = {
  width: 36, height: 36, borderRadius: "10px",
  background: "rgba(126,211,33,0.10)",
  border: "1px solid rgba(126,211,33,0.22)",
  display: "flex", alignItems: "center", justifyContent: "center",
  flexShrink: 0,
};

export function ChatSection() {
  const [isOpen, setIsOpen]   = useState(false);
  const [input, setInput]     = useState("");
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const bottomRef             = useRef<HTMLDivElement>(null);
  const inputRef              = useRef<HTMLInputElement>(null);
  const sectionRef            = useRef<HTMLElement>(null);
  const sendMessage           = useSendChatMessage();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, sendMessage.isPending]);

  useEffect(() => {
    if (isOpen) {
      /* Center the section in the viewport after it expands */
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        inputRef.current?.focus();
      }, 180);
    }
  }, [isOpen]);

  const submit = (msg?: string) => {
    const text = (msg ?? input).trim();
    if (!text || sendMessage.isPending) return;
    setInput("");
    const next: ChatHistoryItem[] = [...history, { role: "user", content: text }];
    setHistory(next);
    sendMessage.mutate(
      { data: { message: text, history } },
      {
        onSuccess: (d) => setHistory([...next, { role: "assistant", content: d.reply }]),
        onError:   ()  => setHistory([...next, { role: "assistant", content: "Something went wrong — please try again." }]),
      }
    );
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
  };

  return (
    <section
      ref={sectionRef}
      id="ai-chat"
      style={{
        background: "#f7f5f1",
        borderTop: "1px solid rgba(0,0,0,0.07)",
        padding: isOpen
          ? "clamp(3rem, 5vh, 4rem) clamp(1.5rem, 5vw, 5rem)"
          : "clamp(5rem, 10vh, 8rem) clamp(1.5rem, 5vw, 5rem)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: isOpen ? "100svh" : "auto",
        transition: "padding 0.3s, min-height 0.3s",
      }}
    >
      <div style={{ width: "100%", maxWidth: "min(680px, 100%)" }}>
        <AnimatePresence mode="wait">
          {!isOpen ? (

            /* ── COLLAPSED: pill ── */
            <motion.button
              key="pill"
              onClick={() => setIsOpen(true)}
              data-testid="button-ask-dcortex"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25, ease: EASE }}
              style={{
                width: "100%",
                display: "flex", alignItems: "center", gap: "1rem",
                padding: "0.75rem 0.75rem",
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.09)",
                borderRadius: "14px",
                cursor: "pointer",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                transition: "box-shadow 0.2s, border-color 0.2s",
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.09)";
                e.currentTarget.style.borderColor = "rgba(126,211,33,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
                e.currentTarget.style.borderColor = "rgba(0,0,0,0.09)";
              }}
            >
              <div style={sparkleBox}>
                <Sparkles className="w-4 h-4" style={{ color: "#7ed321" }} />
              </div>
              <span style={{ flex: 1, fontSize: "0.9375rem", color: "rgba(13,13,13,0.36)", fontWeight: 500 }}>
                Ask dCortex anything.
              </span>
              <div style={{
                width: 36, height: 36, borderRadius: "9px",
                background: "rgba(0,0,0,0.06)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Send className="w-3.5 h-3.5" style={{ color: "rgba(13,13,13,0.30)" }} />
              </div>
            </motion.button>

          ) : (

            /* ── EXPANDED: inline card, scrolls with page ── */
            <motion.div
              key="card"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.3, ease: EASE }}
              style={{
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.09)",
                borderRadius: "18px",
                overflow: "hidden",
                boxShadow: "0 12px 48px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
                height: "min(580px, calc(100svh - 8rem))",
              }}
            >
              {/* ── Header: logo + close ── */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0.875rem 1rem",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
                background: "#ffffff", flexShrink: 0,
              }}>
                <img src={logoFull} alt="dCortex" style={{ height: 22, width: "auto" }} />
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                  style={{
                    width: 28, height: 28, borderRadius: "7px",
                    background: "rgba(0,0,0,0.05)", border: "none",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", transition: "background 0.18s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.10)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.05)"; }}
                >
                  <X className="w-3.5 h-3.5" style={{ color: "rgba(13,13,13,0.45)" }} />
                </button>
              </div>

              {/* ── Messages area (scrollable) ── */}
              <div style={{
                flex: 1,
                overflowY: "auto",
                background: "#f7f5f1",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                padding: "1.25rem",
              }}>
                {history.length === 0 ? (
                  <div style={{
                    flex: 1, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    gap: "1rem", textAlign: "center", paddingBottom: "1rem",
                  }}>
                    <p style={{ fontSize: "0.8rem", color: "rgba(13,13,13,0.38)", fontWeight: 500 }}>
                      Start with a question or pick one below
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", justifyContent: "center", maxWidth: "420px" }}>
                      {SAMPLES.map((q) => (
                        <button
                          key={q}
                          onClick={() => submit(q)}
                          style={{
                            padding: "0.38rem 0.8rem", borderRadius: "999px",
                            fontSize: "0.75rem", fontWeight: 500,
                            color: "rgba(13,13,13,0.55)",
                            background: "#ffffff",
                            border: "1px solid rgba(0,0,0,0.09)",
                            cursor: "pointer", transition: "all 0.18s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = "#0d0d0d";
                            e.currentTarget.style.borderColor = "rgba(126,211,33,0.40)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "rgba(13,13,13,0.55)";
                            e.currentTarget.style.borderColor = "rgba(0,0,0,0.09)";
                          }}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {history.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}
                      >
                        <div style={{
                          maxWidth: "80%", padding: "0.6rem 0.95rem",
                          borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                          fontSize: "0.8125rem", lineHeight: 1.6, fontWeight: 450,
                          ...(msg.role === "user"
                            ? { background: "#7ed321", color: "#07090b" }
                            : { background: "#ffffff", color: "#0d0d0d", border: "1px solid rgba(0,0,0,0.07)" }),
                        }}>
                          {msg.content}
                        </div>
                      </motion.div>
                    ))}
                    {sendMessage.isPending && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ display: "flex", justifyContent: "flex-start" }}
                      >
                        <div style={{
                          padding: "0.65rem 0.95rem",
                          borderRadius: "14px 14px 14px 4px",
                          background: "#ffffff", border: "1px solid rgba(0,0,0,0.07)",
                          display: "flex", gap: "4px", alignItems: "center",
                        }}>
                          {[0, 0.15, 0.3].map((d) => (
                            <motion.div
                              key={d}
                              style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(13,13,13,0.25)" }}
                              animate={{ y: [0, -4, 0] }}
                              transition={{ duration: 0.7, repeat: Infinity, delay: d }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                    <div ref={bottomRef} />
                  </>
                )}
              </div>

              {/* ── Input bar (bottom) ── */}
              <div style={{
                display: "flex", alignItems: "center", gap: "0.875rem",
                padding: "0.75rem 0.875rem",
                borderTop: "1px solid rgba(0,0,0,0.06)",
                background: "#ffffff", flexShrink: 0,
              }}>
                <div style={sparkleBox}>
                  <Sparkles className="w-4 h-4" style={{ color: "#7ed321" }} />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask dCortex anything."
                  data-testid="input-chat"
                  style={{
                    flex: 1, background: "transparent",
                    border: "none", outline: "none",
                    fontSize: "0.9375rem", color: "#0d0d0d",
                    caretColor: "#7ed321",
                  }}
                />
                <button
                  onClick={() => submit()}
                  data-testid="button-send-chat"
                  disabled={!input.trim() || sendMessage.isPending}
                  style={{
                    width: 36, height: 36, borderRadius: "9px",
                    background: input.trim() ? "#7ed321" : "rgba(0,0,0,0.06)",
                    border: "none",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, cursor: input.trim() ? "pointer" : "default",
                    transition: "background 0.2s",
                  }}
                >
                  <Send className="w-3.5 h-3.5" style={{ color: input.trim() ? "#07090b" : "rgba(13,13,13,0.30)" }} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
