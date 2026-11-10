import pool from "../db_conn.js";

const testConnection = async () => {
  try {
    //const result = await pool.query("SELECT NOW()");
    /*const result = await pool.query(
      "INSERT INTO tasks (title) VALUES ($1) RETURNING *",
      ["Learn PostgreSQL"]
    );*/

    const result = await pool.query(`
      SELECT id, title, description, completed, createdAt FROM tasks ORDER BY id
    `);

    /*const result = await pool.query(
      "UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *",
      [true, 1]
    );*/

    console.log(result.rows[0]);

    console.log("Database connected successfully!");
    //console.log(result.rows);

  } catch (error) {
    console.error("Database connection failed:", error.message);

  } finally {
    await pool.end();
  }
};

testConnection();