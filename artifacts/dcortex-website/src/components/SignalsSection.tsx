import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Rss, Linkedin, FileText, Radio } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const signals = [
  {
    id: 1,
    type: "Substack",
    Icon: Rss,
    title: "How legacy scheduling systems fail during cascading weather events",
    excerpt:
      "An analysis of the recent winter storm operational meltdown and how a System of Action prevents cascading delays.",
    linkText: "Read Article",
  },
  {
    id: 2,
    type: "LinkedIn",
    Icon: Linkedin,
    title: "The operational cost of crew misconnection",
    excerpt:
      "When plans meet reality, airlines lose millions not to the primary delay, but to secondary crew legality issues.",
    linkText: "View Post",
  },
  {
    id: 3,
    type: "Press",
    Icon: FileText,
    title: "dCortex announces strategic partnership for gate optimisation",
    excerpt:
      "New deployment shows 24% faster recovery times during hub constraint scenarios.",
    linkText: "Read Release",
  },
  {
    id: 4,
    type: "Media",
    Icon: Radio,
    title: "Aviation Weekly: The rise of Systems of Action",
    excerpt:
      "Why the rip-and-replace era is ending, and the coordination era is beginning for major carriers.",
    linkText: "View Coverage",
  },
];

const tabs = ["All", "Substack", "LinkedIn", "Press", "Media"];

export function SignalsSection() {
  const [activeTab, setActiveTab] = useState("All");

  const visible =
    activeTab === "All"
      ? signals
      : signals.filter((s) => s.type === activeTab);

  return (
    <section
      className="py-24 md:py-32"
      style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}
      id="signals"
    >
      <div className="container mx-auto px-4 md:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex items-end justify-between mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Latest Signals
          </h2>
          <a
            href="#"
            className="hidden md:inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group"
          >
            View all
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150" />
          </a>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
          className="flex items-center gap-2 mb-10 flex-wrap"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={
                activeTab !== tab
                  ? { background: "#ffffff", border: "1px solid rgba(0,0,0,0.09)" }
                  : {}
              }
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* 4-column card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {visible.map((signal, i) => (
            <motion.a
              key={signal.id}
              href="#"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300"
              style={{
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              {/* Thumbnail area */}
              <div
                className="relative aspect-[16/9] flex items-center justify-center overflow-hidden"
                style={{ background: "#f0ede8" }}
              >
                <signal.Icon className="w-10 h-10" style={{ color: "rgba(0,0,0,0.07)" }} />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(255,255,255,0.6) 0%, transparent 60%)" }}
                />
                {/* Badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold"
                    style={{ background: "rgba(255,255,255,0.85)", color: "rgba(0,0,0,0.55)", border: "1px solid rgba(0,0,0,0.09)" }}
                  >
                    <signal.Icon className="w-3 h-3" />
                    {signal.type}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-sm font-semibold text-foreground/80 group-hover:text-foreground leading-snug mb-2.5 line-clamp-2 transition-colors duration-200">
                  {signal.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1 mb-4">
                  {signal.excerpt}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all duration-200">
                  {signal.linkText}
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </motion.a>
          ))}
        </div>

      </div>
    </section>
  );
}
