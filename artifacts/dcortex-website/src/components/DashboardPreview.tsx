const GREEN = "#7ed321";
const DARK = "#07090b";
const CARD_BG = "#111416";
const MUTED = "rgba(255,255,255,0.38)";
const TEXT_DIM = "rgba(255,255,255,0.62)";
const TEXT_BRIGHT = "#f7f5f1";
const BORDER = "rgba(255,255,255,0.07)";

const flights = [
  { id: "EK202", route: "DXB → LHR", status: "On Track", time: "08:14", color: GREEN },
  { id: "QR517", route: "DOH → JFK", status: "Delayed 12m", time: "09:02", color: "#f5a623" },
  { id: "EK404", route: "DXB → BOM", status: "On Track", time: "09:30", color: GREEN },
  { id: "FZ118", route: "DXB → CAI", status: "Gate Change", time: "09:55", color: "#e8e82a" },
  { id: "EK762", route: "DXB → SYD", status: "On Track", time: "10:10", color: GREEN },
];

const bars = [62, 88, 75, 92, 68, 95, 84];
const barLabels = ["M", "T", "W", "T", "F", "S", "S"];

export default function DashboardPreview() {
  return (
    <div
      style={{
        background: DARK,
        borderRadius: 16,
        border: `1px solid ${BORDER}`,
        overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
        width: "100%",
        boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          padding: "12px 18px",
          borderBottom: `1px solid ${BORDER}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#0c0e11",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: TEXT_BRIGHT, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Operations Control
          </span>
        </div>
        <span style={{ fontSize: 10, color: MUTED }}>Live · 06:24 UTC</span>
      </div>

      {/* Metric cards row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, borderBottom: `1px solid ${BORDER}`, background: BORDER }}>
        {[
          { label: "On-Time Rate", value: "94.1%", delta: "+2.3%", up: true },
          { label: "Active Flights", value: "187", delta: "All monitored", up: true },
          { label: "Open Alerts", value: "3", delta: "↓ from 11", up: true },
        ].map((m) => (
          <div key={m.label} style={{ background: CARD_BG, padding: "14px 16px" }}>
            <div style={{ fontSize: 10, color: MUTED, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.07em" }}>{m.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: TEXT_BRIGHT, lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: 10, color: GREEN, marginTop: 4, fontWeight: 600 }}>{m.delta}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 1, background: BORDER }}>
        {/* Flight list */}
        <div style={{ background: CARD_BG, padding: "16px" }}>
          <div style={{ fontSize: 10, color: MUTED, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>
            Upcoming Departures
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {flights.map((f) => (
              <div
                key={f.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 10px",
                  borderRadius: 7,
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${BORDER}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: f.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: TEXT_BRIGHT }}>{f.id}</span>
                  <span style={{ fontSize: 10, color: MUTED }}>{f.route}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      color: f.color,
                      background: `${f.color}18`,
                      padding: "2px 7px",
                      borderRadius: 4,
                    }}
                  >
                    {f.status}
                  </span>
                  <span style={{ fontSize: 10, color: TEXT_DIM, fontVariantNumeric: "tabular-nums" }}>{f.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mini chart */}
        <div style={{ background: CARD_BG, padding: "16px", display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 10, color: MUTED, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>
            On-Time %  · 7-day
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 5,
                height: 72,
              }}
            >
              {bars.map((h, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div
                    style={{
                      width: "100%",
                      height: `${h}%`,
                      background: i === bars.length - 1 ? GREEN : `${GREEN}55`,
                      borderRadius: "3px 3px 0 0",
                    }}
                  />
                  <span style={{ fontSize: 8, color: MUTED }}>{barLabels[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mini alerts */}
          <div style={{ marginTop: 14, borderTop: `1px solid ${BORDER}`, paddingTop: 12 }}>
            <div style={{ fontSize: 10, color: MUTED, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>
              Active Alerts
            </div>
            {[
              { msg: "QR517 crew legality — 12 min buffer", col: "#f5a623" },
              { msg: "Gate B14 reassigned — EK404", col: "#e8e82a" },
              { msg: "All other flights nominal", col: GREEN },
            ].map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: a.col, flexShrink: 0 }} />
                <span style={{ fontSize: 9, color: TEXT_DIM, lineHeight: 1.3 }}>{a.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
