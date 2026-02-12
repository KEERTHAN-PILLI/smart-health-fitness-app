import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

import db from "./config/db.js";

// Database migration: Add reset_code columns if they don't exist
(async () => {
  try {
    await db.execute(
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_code VARCHAR(10), ADD COLUMN IF NOT EXISTS reset_code_expires BIGINT"
    );
    console.log("Database migration completed");
  } catch (err) {
    console.log("Migration skipped or already done:", err.message);
  }
})();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
