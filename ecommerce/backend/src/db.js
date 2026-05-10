const mysql = require("mysql2/promise");

let pool;

function getPool() {
  if (pool) return pool;

  pool = mysql.createPool({
    host: process.env.DB_HOST || "db",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "My:S3cr3t",
    database: process.env.DB_NAME || "ecommerce",
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
    namedPlaceholders: true
  });

  return pool;
}

async function pingDb() {
  const p = getPool();
  const conn = await p.getConnection();
  try {
    await conn.ping();
  } finally {
    conn.release();
  }
}

module.exports = { getPool, pingDb };

