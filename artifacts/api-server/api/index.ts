import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const MAIL_RECIPIENTS = ["elango@dcortex.ai", "dani@dcortex.ai", "bandu@dcortex.ai"];
const MAIL_FROM = process.env.SMTP_FROM ?? `"dCortex Website" <${process.env.SMTP_USER}>`;

function createTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return null;
}

function log(level: "info" | "error", data: object, msg: string) {
  console[level === "error" ? "error" : "log"](JSON.stringify({ level, msg, ...data }));
}

app.get("/api/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/contact", async (req, res) => {
  try {
    const { airline, name, designation, purpose } = req.body as {
      airline: string;
      name: string;
      designation: string;
      purpose: string;
    };

    if (!airline || !name || !designation || !purpose) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4ade80;">New Connection Request — dCortex</h2>
        <hr style="border-color: #333;" />
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #666; width: 140px;"><strong>Airline</strong></td><td style="padding: 8px 0;">${airline}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;"><strong>Name</strong></td><td style="padding: 8px 0;">${name}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;"><strong>Designation</strong></td><td style="padding: 8px 0;">${designation}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;"><strong>Purpose</strong></td><td style="padding: 8px 0;">${purpose}</td></tr>
        </table>
        <hr style="border-color: #333;" />
        <p style="color: #999; font-size: 12px;">Submitted via dCortex website contact form.</p>
      </div>
    `;

    const emailText = `New Connection Request — dCortex\n\nAirline: ${airline}\nName: ${name}\nDesignation: ${designation}\nPurpose: ${purpose}`;

    const transporter = createTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: MAIL_FROM,
        to: MAIL_RECIPIENTS.join(", "),
        subject: `Connection Request from ${name} — ${airline}`,
        text: emailText,
        html: emailHtml,
      });
    } else {
      log("info", { airline, name, designation, purpose }, "Contact form submission (SMTP not configured)");
    }

    res.json({ success: true, message: "Your request has been submitted. We'll be in touch soon." });
  } catch (err) {
    log("error", { err }, "Contact form error");
    res.status(500).json({ error: "Failed to submit form. Please try again." });
  }
});

const SYSTEM_PROMPT = `You are dCortex's intelligent assistant. dCortex is an aviation superintelligence company — a System of Action that coordinates crews, gates, schedules, maintenance, and operational constraints, helping airlines recover faster and operate with greater confidence under pressure, without the need for modernization or changes to existing systems.

dCortex works with existing airline systems like SITA, AIIMS, IBS, and others — it sits on top of them, coordinating across all of them to provide real-time operational intelligence and action.

Key facts about dCortex:
- No modernization or upgrades required
- No rip-and-replace of existing systems
- Works with existing systems
- Delivers operational improvement through coordination
- Results visible in weeks, not years
- Built to act — not just to advise

Answer questions concisely and accurately about dCortex, its capabilities, how it works, and aviation operations. If you don't know something specific, say so honestly. Keep answers focused and professional. Do not make up pricing or specific customer names unless they are publicly known.`;

app.post("/api/chat", async (req, res) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      res.status(503).json({ error: "Chat service not configured" });
      return;
    }

    const { message, history } = req.body as {
      message: string;
      history: { role: "user" | "assistant"; content: string }[];
    };

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(history || []).map((h: { role: string; content: string }) => ({ role: h.role, content: h.content })),
      { role: "user", content: message },
    ];

    const fetchResponse = await (globalThis.fetch as typeof fetch)("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: "gpt-4o-mini", messages, max_tokens: 512 }),
    });

    if (!fetchResponse.ok) {
      throw new Error(`OpenAI API error: ${fetchResponse.status}`);
    }

    const data = await fetchResponse.json() as { choices: { message: { content: string } }[] };
    const reply = data.choices[0]?.message?.content ?? "I'm unable to respond right now. Please try again.";
    res.json({ reply });
  } catch (err) {
    log("error", { err }, "Chat error");
    res.status(500).json({ error: "Failed to get response" });
  }
});

export default app;
