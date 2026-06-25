import nodemailer from "nodemailer";

export const MAIL_RECIPIENTS = [
  "elango@dcortex.ai",
  "dani@dcortex.ai",
  "bandu@dcortex.ai",
];

export function createTransporter() {
  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  ) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
}

export const MAIL_FROM =
  process.env.SMTP_FROM ?? `"dCortex Website" <${process.env.SMTP_USER}>`;
