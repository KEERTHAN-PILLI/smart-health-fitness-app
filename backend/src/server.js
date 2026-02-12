import dotenv from "dotenv";
import app from "./app.js";

// CRITICAL: Load .env FIRST
dotenv.config();

console.log("✅ RESEND_API_KEY loaded:", process.env.RESEND_API_KEY ? "YES" : "NO");
console.log("✅ FROM_EMAIL loaded:", process.env.FROM_EMAIL ? "YES" : "NO");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Import and initialize database AFTER env vars are loaded
  const { default: db, initializeDatabase } = await import("./config/db.js");
  
  // Initialize database connection
  initializeDatabase();
  
  // Run database migration - try multiple approaches
  try {
    // Try to add reset_code
    try {
      await db.execute("ALTER TABLE users ADD COLUMN reset_code VARCHAR(10)");
      console.log("✅ Added reset_code column");
    } catch (e) {
      if (e.message.includes("Duplicate column")) {
        console.log("✅ reset_code column already exists");
      } else if (!e.message.includes("syntax")) {
        throw e;
      }
    }
    
    // Try to add reset_code_expires
    try {
      await db.execute("ALTER TABLE users ADD COLUMN reset_code_expires BIGINT");
      console.log("✅ Added reset_code_expires column");
    } catch (e) {
      if (e.message.includes("Duplicate column")) {
        console.log("✅ reset_code_expires column already exists");
      } else if (!e.message.includes("syntax")) {
        throw e;
      }
    }
    
    console.log("✅ Database migration completed");
  } catch (err) {
    console.log("⚠️ Migration error:", err.message);
  }

  // Start the Express server
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
};

startServer().catch(err => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
