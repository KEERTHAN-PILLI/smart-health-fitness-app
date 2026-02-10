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

  const [users] = await db.query(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );

  if (users.length === 0) {
    return res.status(404).json({ message: "Email not found" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

  await db.query(
    "UPDATE users SET reset_code=?, reset_code_expiry=? WHERE email=?",
    [otp, expiry, email]
  );

  await sendEmail(
    email,
    "Password Reset OTP",
    `Your OTP is ${otp}. Valid for 10 minutes.`
  );

  res.json({ message: "OTP sent to email" });
});

//reset password
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const [users] = await db.query(
    "SELECT * FROM users WHERE email=? AND reset_code=?",
    [email, otp]
  );

  if (users.length === 0) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  if (Date.now() > users[0].reset_code_expiry) {
    return res.status(400).json({ message: "OTP expired" });
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await db.query(
    "UPDATE users SET password=?, reset_code=NULL, reset_code_expiry=NULL WHERE email=?",
    [hashed, email]
  );

  res.json({ message: "Password reset successful" });
});

//verify otp
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const [users] = await db.query(
    "SELECT * FROM users WHERE email=? AND reset_code=?",
    [email, otp]
  );

  if (users.length === 0) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  if (Date.now() > users[0].reset_code_expiry) {
    return res.status(400).json({ message: "OTP expired" });
  }

  res.json({ message: "OTP verified" });
});


export default router;
