import nodemailer from "nodemailer";

import { env } from "@/config/env";

type ResetPasswordEmailPayload = {
  to: string;
  resetUrl: string;
};

const canSendSmtpEmail = () =>
  Boolean(env.SMTP_HOST && env.SMTP_PORT && env.SMTP_FROM);

const createTransporter = () =>
  nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth:
      env.SMTP_USER && env.SMTP_PASS
        ? {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS,
          }
        : undefined,
  });

const buildTextBody = (resetUrl: string) =>
  [
    "We received a request to reset your password.",
    "",
    "Use the link below to set a new password:",
    resetUrl,
    "",
    "If you did not request this, you can safely ignore this email.",
  ].join("\n");

const buildHtmlBody = (resetUrl: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; line-height: 1.6; color: #111827;">
    <h2 style="margin-bottom: 12px;">Reset your password</h2>
    <p style="margin: 0 0 16px;">We received a request to reset your password.</p>
    <p style="margin: 0 0 20px;">
      <a href="${resetUrl}" style="display: inline-block; background: #111827; color: #ffffff; text-decoration: none; padding: 10px 16px; border-radius: 8px;">
        Reset Password
      </a>
    </p>
    <p style="margin: 0 0 12px;">If the button does not work, copy and paste this URL:</p>
    <p style="word-break: break-all; margin: 0 0 16px;">${resetUrl}</p>
    <p style="margin: 0; color: #6b7280; font-size: 14px;">If you did not request this, you can safely ignore this email.</p>
  </div>
`;

export async function sendResetPasswordEmail({
  to,
  resetUrl,
}: ResetPasswordEmailPayload) {
  if (!canSendSmtpEmail()) {
    console.info("[auth] SMTP is not configured. Password reset email was skipped.");
    console.info(`[auth] Reset password link for ${to}: ${resetUrl}`);
    return;
  }

  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: env.SMTP_FROM,
      to,
      subject: "Reset your password",
      text: buildTextBody(resetUrl),
      html: buildHtmlBody(resetUrl),
    });
  } catch (error) {
    console.error("[auth] Failed to send reset password email.", error);
    console.info(`[auth] Reset password link for ${to}: ${resetUrl}`);
  }
}
