import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import sendEmail from "../utils/sendEmail.js";



const router = express.Router();

/**
 * REGISTER
 */
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // ✅ CHECK USER BY EMAIL ONLY
    const [existing] = await db.execute(
      "SELECT id, email FROM users WHERE email = ?",
      [email]
    );

    console.log("REGISTER CHECK:", email, existing);

    if (existing.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    // ✅ HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ INSERT USER
    await db.execute(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );

    return res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * LOGIN
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const [users] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "Email not found" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 10 * 60 * 1000; // 10 mins

    await db.execute(
      "UPDATE users SET reset_code=?, reset_code_expiry=? WHERE email=?",
      [code, expiry, email]
    );

    await sendEmail(
      email,
      "Password Reset Code",
      `Your password reset code is: ${code}`
    );

    res.json({ message: "Reset code sent to email" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const [users] = await db.execute(
      "SELECT reset_code, reset_code_expiry FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const user = users[0];

    if (
      user.reset_code !== code ||
      Date.now() > user.reset_code_expiry
    ) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.execute(
      "UPDATE users SET password=?, reset_code=NULL, reset_code_expiry=NULL WHERE email=?",
      [hashedPassword, email]
    );

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
