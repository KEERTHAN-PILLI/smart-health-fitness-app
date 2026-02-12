import mysql from "mysql2/promise";

let pool = null;

export function initializeDatabase() {
  if (pool) return pool;
  
  console.log("🔍 Attempting database connection with:");
  console.log("   Host:", process.env.MYSQLHOST || process.env.DB_HOST || "NOT SET");
  console.log("   User:", process.env.MYSQLUSER || process.env.DB_USER || "NOT SET");
  console.log("   Database:", process.env.MYSQLDATABASE || process.env.DB_NAME || "NOT SET");
  console.log("   Port:", process.env.MYSQLPORT || process.env.DB_PORT || "NOT SET");

  const dbConfig = {
    host: process.env.MYSQLHOST || process.env.DB_HOST,
    user: process.env.MYSQLUSER || process.env.DB_USER,
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
    database: process.env.MYSQLDATABASE || process.env.DB_NAME,
    port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || "3306"),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };

  pool = mysql.createPool(dbConfig);
  
  // Test connection
  pool.getConnection()
    .then(connection => {
      console.log("✅ Database connected successfully!");
      connection.release();
    })
    .catch(err => {
      console.error("❌ Database connection failed:", err.message);
    });
  
  return pool;
}

// Default export returns uninitialized pool for compatibility
export default {
  execute: async (...args) => {
    if (!pool) initializeDatabase();
    return pool.execute(...args);
  },
  getConnection: async () => {
    if (!pool) initializeDatabase();
    return pool.getConnection();
  },
  query: async (...args) => {
    if (!pool) initializeDatabase();
    return pool.query(...args);
  }
};
