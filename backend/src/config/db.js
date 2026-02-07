import mysql from "mysql2";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "9392413065",
  database: "smart_health_fitness"
});

export default db;
