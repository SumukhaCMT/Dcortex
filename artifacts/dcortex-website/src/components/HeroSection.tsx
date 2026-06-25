import React, { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const PROBLEMS = [
  "One flight delay, the crew goes out of legality.",
  "One storm, all gates have to be reassigned.",
  "Passengers get delayed for meetings, weddings, appointments.",
  "Crew rushes, breaks plans, and still can't catch up with reality.",
];

/* Pre-compute global character index for each character in each line */
const CHAR_META: { char: string; globalIndex: number }[][] = (() => {
  let g = 0;
  return PROBLEMS.map((text) =>
    text.split("").map((char) => ({ char, globalIndex: g++ }))
  );
})();
const TOTAL_CHARS = PROBLEMS.reduce((sum, p) => sum + p.length, 0);

export function HeroSection() {
  const { scrollY } = useScroll();

  /* revealCount = how many chars are "lit up" (0 → TOTAL_CHARS) */
  const [revealCount, setRevealCount] = useState(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    const vh = window.innerHeight;
    /* Reveal all chars within the first 45% of viewport height of scroll */
    const progress = Math.max(0, Math.min(1, y / (vh * 0.45)));
    setRevealCount(Math.round(progress * TOTAL_CHARS));
  });

  return (
    <div
      style={{
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "#07090b",
      }}
    >
      {/* Full-bleed hero video */}
      <video
        src="/hero-video.mp4"
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 40%",
        }}
      />

      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(105deg, rgba(7,9,11,0.85) 0%, rgba(7,9,11,0.68) 40%, rgba(7,9,11,0.24) 65%, transparent 80%)",
          pointerEvents: "none",
        }}
      />
      {/* Bottom vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(7,9,11,0.45) 0%, transparent 35%)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingTop: "80px",
          paddingBottom: "clamp(2rem, 6vh, 5rem)",
          paddingLeft: "clamp(2rem, 7vw, 7rem)",
          paddingRight: "clamp(2rem, 7vw, 7rem)",
        }}
      >
        {/* ── Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          style={{ marginBottom: "clamp(1.2rem, 2.5vh, 2rem)" }}
        >
          {/* Line 1 — white */}
          <span
            className="hero-nowrap"
            style={{
              display: "block",
              fontSize: "clamp(1.56rem, 3.36vw, 4.32rem)",
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-0.025em",
              color: "#f7f5f1",
              marginBottom: "0.08em",
            }}
          >
            Airline operations has only 1 real challenge
          </span>
          {/* Line 2 — italic green */}
          <h1
            className="hero-nowrap"
            style={{
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-0.025em",
              fontStyle: "italic",
              color: "#7ed321",
              fontSize: "clamp(1.56rem, 3.36vw, 4.32rem)",
              margin: 0,
            }}
          >
            When plans meet reality.
          </h1>
        </motion.div>


        {/* ── Problem texts: scroll-driven character reveal ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "clamp(0.5rem, 1vh, 0.85rem)",
            maxWidth: "min(72%, 920px)",
          }}
        >
          {CHAR_META.map((line, lineIndex) => (
            <p
              key={lineIndex}
              style={{
                fontSize: "clamp(1.15rem, 1.6vw, 1.5rem)",
                lineHeight: 1.55,
                fontWeight: 500,
                margin: 0,
              }}
            >
              {line.map(({ char, globalIndex }) => (
                <span
                  key={globalIndex}
                  style={{
                    color:
                      revealCount > globalIndex
                        ? "rgba(247,245,241,0.84)"
                        : "rgba(247,245,241,0)",
                    transition:
                      revealCount > globalIndex
                        ? "color 0.12s ease"
                        : "none",
                  }}
                >
                  {char}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
