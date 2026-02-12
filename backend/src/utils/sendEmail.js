import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendEmail({ to, subject, html }) {
  try {
    const { error } = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend email error:", error);
      throw new Error("Failed to send email");
    }
  } catch (err) {
    console.error("Error in sendEmail util:", err);
    throw err;
  }
}
