import nodemailer from "nodemailer";

let transporter = null;

export default async function sendEmail({ to, subject, html }) {
  // Initialize transporter only when function is called
  if (!transporter) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("❌ EMAIL_USER or EMAIL_PASS is missing from environment variables");
      throw new Error("Email configuration is incomplete");
    }

    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log("✅ Gmail SMTP transporter initialized successfully");
  }

  try {
    const info = await transporter.sendMail({
      from: `"Smart Health Fitness" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully to:", to);
    console.log("Message ID:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Error in sendEmail util:", err);
    throw err;
  }
}
