import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);


const [existing] = await db.execute(
  "SELECT id, email FROM users WHERE email = ?",
  [email]
);

console.log("REGISTER CHECK:", email, existing);

if (existing.length > 0) {
  return res.status(409).json({ message: "User already exists" });
}


export default router;
