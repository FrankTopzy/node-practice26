import { Pool } from "pg";


export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "task_manager",
  password: "your_password",
  port: 5432,
});

const result1 = await pool.query("SELECT * FROM tasks");

console.log(result.rows);


const result2 = await pool.query(
  "SELECT * FROM tasks WHERE id = 1"
);

const result3 = await pool.query(
  "SELECT * FROM tasks WHERE id = $1",
  [taskId]
);