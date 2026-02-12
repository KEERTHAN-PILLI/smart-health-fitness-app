import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import sendEmail from "../utils/sendEmail.js";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  db.execute(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword, role],
    (err) => {
      if (err) {
        return res.status(400).json({ message: "User already exists" });
      }
      res.status(201).json({ message: "Registration successful" });
    }
  );
};

export const login = (req, res) => {
  const { email, password } = req.body;

  db.execute(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err || result.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({ token, role: user.role });
    }
  );

  export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const [rows] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = "" + Math.floor(100000 + Math.random() * 900000);

    await db.execute(
      "UPDATE users SET reset_code = ?, reset_code_expires = DATE_ADD(NOW(), INTERVAL 10 MINUTE) WHERE email = ?",
      [otp, email]
    );

    await sendEmail({
      to: email,
      subject: "Your password reset code",
      html: `<p>Your password reset code is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
    });

    return res.json({ message: "Reset code sent to your email" });
  } catch (err) {
    console.error("Error in forgotPassword:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

  // STEP 2: Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const [rows] = await db.execute(
      "SELECT id, reset_code, reset_code_expires FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    // Check if OTP matches
    if (user.reset_code !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if OTP has expired
    if (new Date() > new Date(user.reset_code_expires)) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    return res.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("Error in verifyOtp:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

  // STEP 3: Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset code
    await db.execute(
      "UPDATE users SET password = ?, reset_code = NULL, reset_code_expires = NULL WHERE email = ?",
      [hashedPassword, email]
    );

    return res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

};
