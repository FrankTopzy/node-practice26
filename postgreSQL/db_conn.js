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

const result4 = await pool.query(
  "INSERT INTO tasks (title, user_id) VALUES ($1, $2) RETURNING *",
  [title, userId]
);

const newTask = result4.rows[0];


const result5 = await pool.query(
  "UPDATE tasks SET title = $1 WHERE id = $2 RETURNING *",
  ["Master React", 1]
);


const result6 = await pool.query(
  "DELETE FROM tasks WHERE id = $1 RETURNING *",
  [3]
);