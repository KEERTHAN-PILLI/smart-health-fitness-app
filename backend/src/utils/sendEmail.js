import { Resend } from "resend";

// Don't initialize at import time - wait until function is called
let resend = null;

export default async function sendEmail({ to, subject, html }) {
  // Initialize Resend only when function is called (after dotenv loaded)
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY is missing from environment variables");
      throw new Error("RESEND_API_KEY environment variable is not set");
    }
    resend = new Resend(process.env.RESEND_API_KEY);
    console.log("✅ Resend initialized successfully");
  }

  try {
    const { error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || "noreply@example.com",
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend email error:", error);
      throw new Error("Failed to send email");
    }
    
    console.log("✅ Email sent successfully to:", to);
  } catch (err) {
    console.error("Error in sendEmail util:", err);
    throw err;
  }
}
