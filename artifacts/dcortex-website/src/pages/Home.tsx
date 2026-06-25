import React, { useRef, useState, useEffect } from "react";
import { Link } from "wouter";
import {
  motion, useScroll, useTransform, useSpring,
  useMotionValue, animate, useInView,
} from "framer-motion";
import {
  Menu, X, ChevronRight,
  Linkedin, Mail,
  Users, GitMerge, BookOpen,
} from "lucide-react";
import logoFull from "@assets/dcortex_final_logo-01_1782276213529.png";
import { HeroSection } from "@/components/HeroSection";
import { ChatSection } from "@/components/ChatSection";
import { SignalsSection } from "@/components/SignalsSection";
import { ContactModal } from "@/components/ContactModal";
import DashboardPreview from "@/components/DashboardPreview";

/* ─── design tokens ──────────────────────────────────────── */
const EASE = [0.16, 1, 0.3, 1] as const;
const BG = "#f7f5f1";
const BG_ALT = "#f0ede8";
const CARD_BG = "#ffffff";
const BORDER = "rgba(0,0,0,0.07)";
const TEXT = "#0d0d0d";
const MUTED = "rgba(13,13,13,0.44)";
const GREEN = "#7ed321";
const DARK = "#07090b";

const BIG_HEADING = "clamp(3rem, 6.5vw, 8rem)";
const CTA_HEADING = "clamp(2.4rem, 4.4vw, 5.2rem)";
const SEC_HEADING = "clamp(2.2rem, 4.2vw, 5.2rem)";

const BULLETS = [
  "No modernization or upgrades required",
  "Results in weeks",
  "Operational improvement through coordination",
];

const founders = [
  {
    initials: "ER",
    name: "Elango R.",
    role: "CEO & Co-founder",
    photo: "/founder-elango.png",
    quote: "We built dCortex because we watched brilliant operations teams fight their own tools every single day. The disruption wasn't the problem — the coordination breakdown was.",
  },
  {
    initials: "DR",
    name: "Dani Rayan",
    role: "CTO & Co-founder",
    photo: "/founder-dani.png",
    quote: "Every airline has a war room. We asked: what if the war room could coordinate itself, in real time, without a human needing to make every call?",
  },
  {
    initials: "JB",
    name: "Jayaprakash Bandu",
    role: "CRO & Co-founder",
    photo: "/founder-bandu.png",
    quote: "Recovery time is money. Confidence under pressure is culture. dCortex gives you both — without replacing what you've already built.",
  },
];

const caseStudies = [
  {
    Icon: Users,
    sector: "Crew Operations",
    metric: 62,
    suffix: "%",
    unit: "faster crew reassignment",
    title: "Cascading crew illegality, contained.",
    body: "A major hub carrier faced a 3-day weather disruption threatening 140+ flights. dCortex coordinated crew constraints in real time, eliminating secondary delays before they reached passengers.",
  },
  {
    Icon: GitMerge,
    sector: "Gate & Ground Operations",
    metric: 24,
    suffix: "%",
    unit: "reduction in recovery time",
    title: "Hub constraint, resolved in sequence.",
    body: "An unexpected gate shortage during peak operations would have cascaded across the network. dCortex dynamically reallocated resources and returned ground ops to sequence before the disruption compounded.",
  },
];

/* ─── CountUp ────────────────────────────────────────────── */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });          // count runs once on first view
  const count = useMotionValue(0);
  const display = useTransform(count, (v) => `${Math.round(v)}${suffix}`);
  useEffect(() => {
    if (!isInView) return;
    const c = animate(count, to, { duration: 1.8, ease: "easeOut" });
    return c.stop;
  }, [isInView]);
  return <motion.span ref={ref}>{display}</motion.span>;
}

/*
 * RevealWords — word-by-word slide up.
 * once: false  → words slide back down when section leaves view,
 *                slide up again when it re-enters (bidirectional as requested).
 */
function RevealWords({
  children,
  delay = 0,
  style,
  className,
}: {
  children: string;
  delay?: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });
  return (
    <div
      ref={ref}
      className={className}
      style={{ display: "flex", flexWrap: "wrap", columnGap: "0.28em", rowGap: "0.08em", ...style }}
    >
      {children.split(" ").map((word, i) => (
        <span key={i} style={{ overflow: "hidden", display: "inline-block", lineHeight: "inherit" }}>
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: "110%", opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: "110%", opacity: 0 }}
            transition={{ duration: 0.6, delay: delay + i * 0.07, ease: EASE }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </div>
  );
}

/*
 * FadeUp — generic fade+rise.
 * once: false → reverses when section leaves view.
 */
function FadeUp({
  children,
  delay = 0,
  style,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.65, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Home ───────────────────────────────────────────────── */
export default function Home() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /* Scroll-aware nav: dark (transparent) on hero, light when past hero */
  const [pastHero, setPastHero] = useState(false);
  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 1.85);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* CTA parallax */
  const ctaRef = useRef<HTMLElement>(null);
  const { scrollYProgress: ctaSP } = useScroll({ target: ctaRef, offset: ["start end", "end start"] });
  const ctaBgY = useSpring(useTransform(ctaSP, [0, 1], ["8%", "-8%"]), { stiffness: 55, damping: 18 });

  /* "Built to act." zoom — continuous within the green section */
  const builtRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: builtSP } = useScroll({ target: builtRef, offset: ["start start", "end start"] });
  const builtScale = useTransform(builtSP, [0, 0.50], [1, 10]);
  const builtOpacity = useTransform(builtSP, [0.46, 0.92], [1, 0]);

  const scrollToCTA = () => {
    document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  /* Nav colors derived from scroll position */
  const navBg = pastHero ? "rgba(247,245,241,0.96)" : "rgba(7,9,11,0.25)";
  const navBorder = pastHero ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.07)";
  const linkColor = pastHero ? "rgba(13,13,13,0.52)" : "rgba(247,245,241,0.60)";
  const linkHover = pastHero ? "#0d0d0d" : "#f7f5f1";

  return (
    /*
     * overflowX:"clip" instead of "hidden" — clip does NOT create a new
     * scroll container, so position:sticky on the hero still works.
     */
    <div style={{ overflowX: "clip", background: DARK, color: TEXT }}>
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

      {/* ══ NAV — scroll-aware: transparent dark on hero, light cream past it ══ */}
      <nav
        className="fixed top-0 w-full z-50"
        style={{
          background: navBg,
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: `1px solid ${navBorder}`,
          transition: "background 0.45s ease, border-color 0.45s ease",
        }}
      >
        <div
          className="flex items-center justify-between h-20"
          style={{ paddingLeft: "clamp(2rem, 7vw, 7rem)", paddingRight: "clamp(2rem, 5vw, 5rem)" }}
        >
          <Link href="/" className="flex items-center">
            <img src={logoFull} alt="dCortex" className="h-8 md:h-9 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {["Platform", "How It Works", "Insights", "Company"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-sm font-medium"
                style={{ color: linkColor, transition: "color 0.3s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = linkHover)}
                onMouseLeave={(e) => (e.currentTarget.style.color = linkColor)}
              >
                {l}
              </a>
            ))}
            <button
              onClick={scrollToCTA}
              className="dcx-btn px-5 py-2.5 rounded-full text-sm font-semibold"
            >
              Connect with us
            </button>
          </div>

          <button
            className="md:hidden p-2"
            style={{ color: linkColor }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-20 left-0 w-full p-6 flex flex-col gap-5"
            style={{ background: pastHero ? BG : "rgba(7,9,11,0.95)", borderBottom: `1px solid ${navBorder}` }}
          >
            {["Platform", "How It Works", "Insights", "Company"].map((l) => (
              <a key={l} href="#" className="text-sm font-medium" style={{ color: linkColor }} onClick={() => setIsMobileMenuOpen(false)}>{l}</a>
            ))}
            <button onClick={scrollToCTA} className="dcx-btn px-5 py-3 rounded-full text-sm font-semibold">
              Connect with us
            </button>
          </motion.div>
        )}
      </nav>

      {/* ══ HERO — sticky: pins while the content wrapper slides over it ══ */}
      <div style={{ position: "sticky", top: 0, height: "100vh", zIndex: 1, flexShrink: 0 }}>
        <HeroSection />
      </div>

      {/* ══ HERO SCROLL BUFFER — extra vh so content only appears after text reveal ══ */}
      <div style={{ height: "100vh", background: DARK, flexShrink: 0 }} />

      {/* ══ CONTENT WRAPPER — z-index 10 slides over the sticky hero ══════ */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          borderRadius: "20px 20px 0 0",
          overflow: "hidden",
          boxShadow: "0 -12px 50px rgba(0,0,0,0.18)",
        }}
      >

        {/* ── GREEN SECTION + "BUILT TO ACT" ZOOM (one continuous green zone) ── */}
        {/* Part 1: normal content */}
        <section
          style={{
            backgroundColor: GREEN,
            paddingTop: "clamp(2rem, 4vh, 4rem)",
            paddingBottom: "clamp(2rem, 4vh, 4rem)",
            paddingLeft: "clamp(2rem, 7vw, 7rem)",
            paddingRight: "clamp(2rem, 7vw, 7rem)",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: "clamp(2.5rem, 5vw, 5rem)",
              alignItems: "center",
            }}
            className="grid-cols-1 md:grid-cols-2"
          >
            {/* Left: text */}
            <div>
              <h2 style={{ fontSize: BIG_HEADING, fontWeight: 800, lineHeight: 1.04, letterSpacing: "-0.02em", color: DARK, marginBottom: "2.5rem" }}>
                <RevealWords style={{ color: DARK }}>Now, there is a better way.</RevealWords>
              </h2>

              <FadeUp delay={0.15}>
                <p style={{ color: DARK, opacity: 0.70, fontSize: "clamp(1rem, 1.6vw, 1.2rem)", lineHeight: 1.7, marginBottom: "3rem", fontWeight: 500 }}>
                  dCortex is a{" "}
                  <strong style={{ color: "#ffffff", fontWeight: 800, opacity: 1 }}>System of Action</strong>
                  {" "}that coordinates crews, gates, schedules,
                  maintenance, and operational constraints — helping airlines recover faster
                  and operate with greater confidence, without modernization or changes to
                  existing systems.
                </p>

                <div style={{ height: "1px", background: "rgba(0,0,0,0.13)", marginBottom: "2.5rem" }} />

                <div className="grid grid-cols-1 gap-y-4">
                  {BULLETS.map((b, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      viewport={{ once: false, margin: "-30px" }}
                      transition={{ duration: 0.45, delay: 0.05 + i * 0.07, ease: EASE }}
                      className="flex items-center gap-3"
                    >
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(0,0,0,0.30)", flexShrink: 0 }} />
                      <span style={{ fontSize: "0.875rem", fontWeight: 600, color: DARK, opacity: 0.65 }}>{b}</span>
                    </motion.div>
                  ))}
                </div>
              </FadeUp>
            </div>

            {/* Right: gate agent image */}
            <FadeUp delay={0.3}>
              <img
                src="/solution-gate.png"
                alt="Gate agent at work"
                style={{
                  width: "100%",
                  borderRadius: 16,
                  objectFit: "cover",
                  boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
                }}
              />
            </FadeUp>
          </div>
        </section>

        {/* Part 2: "Built to act." zoom — same green bg, feels like the section expanding */}
        <div
          ref={builtRef}
          style={{ height: "80vh", position: "relative", backgroundColor: GREEN, overflow: "clip" }}
        >
          <div
            style={{
              position: "sticky",
              top: 0,
              height: "70vh",
              backgroundColor: GREEN,
              overflow: "visible",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <motion.p
              style={{
                fontWeight: 800,
                color: DARK,
                fontSize: "clamp(2.5rem, 5vw, 5rem)",
                letterSpacing: "-0.025em",
                scale: builtScale,
                opacity: builtOpacity,
                transformOrigin: "center center",
                whiteSpace: "nowrap",
                userSelect: "none",
              }}
            >
              Built to act.
            </motion.p>
          </div>
        </div>

        {/* ── CHAT ─────────────────────────────────────────── */}
        <ChatSection />

        {/* ── SIGNALS ──────────────────────────────────────── */}
        <div style={{ background: BG }}>
          <SignalsSection />
        </div>

        {/* ── FOUNDERS ─────────────────────────────────────── */}
        <section
          id="founders"
          style={{
            background: BG_ALT,
            borderTop: BORDER,
            paddingTop: "clamp(5rem, 12vh, 10rem)",
            paddingBottom: "clamp(5rem, 12vh, 10rem)",
            paddingLeft: "clamp(2rem, 7vw, 7rem)",
            paddingRight: "clamp(2rem, 7vw, 7rem)",
          }}
        >
          <div style={{ marginBottom: "clamp(3rem, 6vh, 5rem)" }}>
            <h2 style={{ fontSize: SEC_HEADING, fontWeight: 800, lineHeight: 1.06, color: TEXT, letterSpacing: "-0.01em" }}>
              <RevealWords>Built by people who've</RevealWords>
              <RevealWords delay={0.35} style={{ color: GREEN }}>been in the room.</RevealWords>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {founders.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 32 }}
                viewport={{ once: false, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group relative text-left rounded-2xl flex flex-col gap-6 overflow-hidden"
                style={{
                  background: CARD_BG,
                  border: `1px solid ${BORDER}`,
                  padding: "2rem",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                <div className="absolute left-0 top-6 bottom-6 w-0.5 rounded-full bg-primary origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
                <div className="flex items-center gap-4">
                  <img
                    src={f.photo}
                    alt={f.name}
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                    style={{ objectPosition: "center top", border: "2px solid rgba(126,211,33,0.25)" }}
                  />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: TEXT }}>{f.name}</p>
                    <p className="text-xs" style={{ color: MUTED }}>{f.role}</p>
                  </div>
                </div>
                <blockquote className="text-sm leading-relaxed flex-1" style={{ color: "rgba(13,13,13,0.50)" }}>
                  "{f.quote}"
                </blockquote>
                {/* "Read more" links to the blog page */}
                <a
                  href="/blog"
                  className="flex items-center gap-2 text-[11px] font-semibold text-primary/50 group-hover:text-primary transition-colors duration-200 w-fit"
                >
                  <BookOpen className="w-3 h-3" />
                  Read more
                </a>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── JOIN US ──────────────────────────────────────── */}
        <section
          style={{
            background: DARK,
            paddingTop: "clamp(5rem, 10vh, 8rem)",
            paddingBottom: "clamp(5rem, 10vh, 8rem)",
            paddingLeft: "clamp(2rem, 7vw, 7rem)",
            paddingRight: "clamp(2rem, 7vw, 7rem)",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "clamp(3rem, 8vw, 6rem)" }}>
            {/* Left — headline + subtext */}
            <div style={{ flex: "1 1 320px" }}>
              <h2 style={{ fontSize: SEC_HEADING, fontWeight: 800, lineHeight: 1.06, letterSpacing: "-0.01em", marginBottom: "1.25rem" }}>
                <RevealWords style={{ color: "#f7f5f1" }}>Help build</RevealWords>
                <RevealWords delay={0.25} style={{ color: "#7ed321" }}>Operational layer.</RevealWords>
              </h2>
              <FadeUp delay={0.2}>
                <p style={{ color: "rgba(247,245,241,0.50)", lineHeight: 1.75, maxWidth: "40ch", fontWeight: 450, fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)" }}>
                  We are a small team solving a problem that has frustrated airline operations for decades. Come work on what actually matters.
                </p>
              </FadeUp>
            </div>

            {/* Right — CTA */}
            <FadeUp delay={0.15}>
              <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingTop: "0.5rem" }}>
                <a
                  href="#"
                  className="dcx-btn inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold w-fit"
                >
                  Explore Opportunities
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ── CASE STUDIES ─────────────────────────────────── */}
        <section
          id="case-studies"
          style={{
            background: BG,
            borderTop: BORDER,
            paddingTop: "clamp(5rem, 12vh, 10rem)",
            paddingBottom: "clamp(5rem, 12vh, 10rem)",
            paddingLeft: "clamp(2rem, 7vw, 7rem)",
            paddingRight: "clamp(2rem, 7vw, 7rem)",
          }}
        >
          <div style={{ marginBottom: "clamp(3rem, 6vh, 5rem)" }}>
            <h2 style={{ fontSize: SEC_HEADING, fontWeight: 800, lineHeight: 1.06, color: TEXT, letterSpacing: "-0.01em" }}>
              <RevealWords>We've spent decades getting better at seeing the problem.
              </RevealWords>
              <RevealWords delay={0.3} style={{ color: GREEN }}>Now it's time to solve it. </RevealWords>
            </h2>
            <FadeUp delay={0.5}>
              <p style={{ marginTop: "clamp(1.5rem, 3vh, 2.5rem)", fontSize: "clamp(1rem, 1.5vw, 1.15rem)", lineHeight: 1.7, color: TEXT, opacity: 0.60, fontWeight: 500, maxWidth: "52ch" }}>
                Dashboards show you the problem. dCortex uses deterministic reasoning to evaluate operational constraints, identify feasible outcomes, and coordinate action across your enterprise.
              </p>
            </FadeUp>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {caseStudies.map((cs, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 32, scale: 0.97 }}
                viewport={{ once: false, margin: "-60px" }}
                transition={{ duration: 0.65, delay: i * 0.1, ease: EASE }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group rounded-2xl overflow-hidden"
                style={{ background: CARD_BG, border: `1px solid ${BORDER}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
              >
                <div className="px-8 pt-9 pb-7 flex items-start justify-between gap-6" style={{ borderBottom: BORDER }}>
                  <div>
                    <p className="text-[9px] tracking-[0.28em] uppercase font-semibold mb-5" style={{ color: MUTED }}>{cs.sector}</p>
                    <span className="font-bold tracking-tighter leading-none block" style={{ fontSize: "clamp(4rem, 8vw, 6rem)", color: TEXT }}>
                      <CountUp to={cs.metric} suffix={cs.suffix} />
                    </span>
                    <p className="text-lg mt-2" style={{ color: MUTED }}>{cs.unit}</p>
                  </div>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 transition-all duration-300 group-hover:border-primary/20 group-hover:bg-primary/5" style={{ background: "rgba(0,0,0,0.03)", border: `1px solid ${BORDER}` }}>
                    <cs.Icon className="w-5 h-5 transition-colors duration-300 text-muted-foreground/40 group-hover:text-primary/50" />
                  </div>
                </div>
                <div className="px-8 py-7">
                  <h3 className="font-semibold mb-3 leading-snug" style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.4rem)", color: "rgba(13,13,13,0.80)" }}>{cs.title}</h3>
                  <p className="text-base leading-relaxed" style={{ color: MUTED }}>{cs.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ══ CTA — dark, different background image ══════════ */}
        <section
          id="cta"
          ref={ctaRef}
          style={{
            position: "relative",
            overflow: "hidden",
            background: DARK,
            paddingTop: "clamp(8rem, 18vh, 14rem)",
            paddingBottom: "clamp(8rem, 18vh, 14rem)",
          }}
        >
          {/* Parallax background — using hero-day (different from hero page) */}
          <motion.div style={{ position: "absolute", inset: 0, y: ctaBgY }}>
            <img
              src="/cta-plane.jpg"
              alt=""
              style={{
                width: "100%",
                height: "120%",
                objectFit: "cover",
                objectPosition: "center 50%",
                display: "block",
                filter: "brightness(0.20) saturate(0.35)",
              }}
            />
          </motion.div>

          {/* Content — z-index above the image */}
          <div style={{ position: "relative", zIndex: 2, paddingLeft: "clamp(2rem, 7vw, 7rem)", paddingRight: "clamp(2rem, 7vw, 7rem)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div className="max-w-3xl">
              <h2 style={{ fontSize: CTA_HEADING, fontWeight: 800, lineHeight: 1.06, letterSpacing: "-0.02em", marginBottom: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <RevealWords style={{ color: "#f7f5f1" }}>Watch dCortex</RevealWords>
                <RevealWords delay={0.22} style={{ color: GREEN }}>in action.</RevealWords>
              </h2>

              <FadeUp delay={0.12}>
                <p style={{ color: "rgba(247,245,241,0.62)", marginBottom: "3rem", lineHeight: 1.7, fontSize: "clamp(0.95rem, 1.4vw, 1.05rem)", maxWidth: "36ch", margin: "0 auto 3rem" }}>
                  Send us a message to get your live demo.
                </p>
                <button
                  onClick={() => setIsContactOpen(true)}
                  className="group dcx-btn inline-flex items-center gap-3 px-9 py-4 rounded-full text-sm font-semibold"
                >
                  Connect with us
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
                </button>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ══ FOOTER ══════════════════════════════════════════ */}
        <footer
          style={{
            background: DARK,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "clamp(3rem, 7vh, 6rem)",
            paddingBottom: "clamp(3rem, 7vh, 6rem)",
            paddingLeft: "clamp(2rem, 7vw, 7rem)",
            paddingRight: "clamp(2rem, 7vw, 7rem)",
          }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12">
            <img src={logoFull} alt="dCortex" className="h-20 w-auto" style={{ opacity: 0.80 }} />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 text-sm w-full md:w-auto">
              <div className="flex flex-col gap-3">
                {[
                  { label: "Why Existing Systems Fail", href: "#" },
                  { label: "How It Works", href: "#" },
                  { label: "The Builders", href: "#founders" },
                ].map(({ label, href }) => (
                  <a key={label} href={href}
                    style={{ color: "rgba(247,245,241,0.52)", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#f7f5f1")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(247,245,241,0.52)")}
                  >
                    {label}
                  </a>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                <a href="https://wellfound.com/company/dcortex/jobs" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(247,245,241,0.52)", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#f7f5f1")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(247,245,241,0.52)")}
                >Careers</a>
                <a href="#" style={{ color: "rgba(247,245,241,0.52)", transition: "color 0.2s", cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#f7f5f1")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(247,245,241,0.52)")}
                  onClick={(e) => { e.preventDefault(); setIsContactOpen(true); }}
                >Demo</a>
                <a href="#" style={{ color: "rgba(247,245,241,0.52)", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#f7f5f1")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(247,245,241,0.52)")}
                >Insights</a>
              </div>
              <div className="col-span-2 md:col-span-1 flex flex-col gap-3 pt-2 md:pt-0" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} >
                <a href="mailto:connect@dcortex.ai" style={{ color: "rgba(247,245,241,0.52)", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#f7f5f1")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(247,245,241,0.52)")}
                >connect@dcortex.ai</a>

                <span style={{ color: "rgba(247,245,241,0.52)" }}>San Francisco, CA</span>
              </div>
            </div>
          </div>

          <div className="mt-10 md:mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-base" style={{ color: "rgba(247,245,241,0.38)" }}>
              © {new Date().getFullYear()} dCortex Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              {[
                { href: "https://linkedin.com/company/dcortex", Icon: Linkedin },
                { href: "mailto:connect@dcortex.ai", Icon: Mail },
              ].map(({ href, Icon }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                  style={{ color: "rgba(247,245,241,0.38)", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#f7f5f1")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(247,245,241,0.38)")}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
              <a href="https://substack.com/@dcortex" target="_blank" rel="noopener noreferrer"
                style={{ color: "rgba(247,245,241,0.38)", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f7f5f1")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(247,245,241,0.38)")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
                </svg>
              </a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
