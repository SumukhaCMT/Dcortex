import { Router } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";

const router = Router();

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

router.post("/chat", async (req, res) => {
  try {
    const { message, history } = req.body as {
      message: string;
      history: { role: "user" | "assistant"; content: string }[];
    };

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(history || []).map((h) => ({
        role: h.role as "user" | "assistant",
        content: h.content,
      })),
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages,
      max_tokens: 512,
    });

    const reply = completion.choices[0]?.message?.content ?? "I'm unable to respond right now. Please try again.";
    res.json({ reply });
  } catch (err) {
    req.log.error({ err }, "Chat error");
    res.status(500).json({ error: "Failed to get response" });
  }
});

export default router;
