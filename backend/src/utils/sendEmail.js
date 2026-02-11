import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text) => {
  try {
    await resend.emails.send({
      from: "smarthealth.app<onboarding@resend.dev>",
      to: to,
      subject: subject,
      text: text,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    throw error;
  }
};

export default sendEmail;
