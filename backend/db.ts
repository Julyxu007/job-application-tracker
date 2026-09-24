import pg from "pg";
import dotenv from "dotenv";
dotenv.config();
const pool = new pg.Pool({
  user: "postgres",
  password: process.env.DB_PASSWORD,
  host: "localhost",
  port: 5432,
  database: "job_tracker",
});
export default pool;
