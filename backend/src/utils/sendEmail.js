import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,               // ✅ CHANGE THIS
      secure: false,           // ✅ MUST BE FALSE
      requireTLS: true,        // ✅ IMPORTANT
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"smart.health.fitness.app@gmail.com" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    throw error;
  }
};

export default sendEmail;
