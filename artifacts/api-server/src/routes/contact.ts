import { Router } from "express";
import { createTransporter, MAIL_FROM, MAIL_RECIPIENTS } from "../lib/mail.config";
import { logger } from "../lib/logger";

const router = Router();

router.post("/contact", async (req, res) => {
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
          <tr>
            <td style="padding: 8px 0; color: #666; width: 140px;"><strong>Airline</strong></td>
            <td style="padding: 8px 0;">${airline}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;"><strong>Name</strong></td>
            <td style="padding: 8px 0;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;"><strong>Designation</strong></td>
            <td style="padding: 8px 0;">${designation}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;"><strong>Purpose</strong></td>
            <td style="padding: 8px 0;">${purpose}</td>
          </tr>
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
      logger.info(
        { airline, name, designation, purpose },
        "Contact form submission (SMTP not configured — set SMTP_HOST, SMTP_USER, SMTP_PASS to enable email delivery)"
      );
    }

    res.json({ success: true, message: "Your request has been submitted. We'll be in touch soon." });
  } catch (err) {
    logger.error({ err }, "Contact form error");
    res.status(500).json({ error: "Failed to submit form. Please try again." });
  }
});

export default router;
