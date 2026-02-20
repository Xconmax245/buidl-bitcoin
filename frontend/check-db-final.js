
const { Client } = require('pg');
const connectionString = "postgresql://postgres.jfpfykjenofhicdqiipc:WihCwZQKA0cDQBuM@16.63.37.107:5432/postgres?sslmode=require";

async function check() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("Connected to DB");
    const res = await client.query("SELECT count(*) FROM pg_tables WHERE schemaname = 'public'");
    console.log("Tables in public schema:", res.rows[0].count);
    const tables = await client.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public'");
    console.log("Table names:", tables.rows.map(r => r.tablename).join(", "));
    await client.end();
  } catch (err) {
    console.error("Connection failed:", err.message);
  }
}
check();
