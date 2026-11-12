import pool from "../db_conn.js";

export const getUserTasks = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if(!Number.isInteger(id) || id <= 0 ) {
      return res.status(400).json({message: "Invalid user ID"});
    }

    const result = await pool.query(`
      SELECT 
        users.id AS user_id,
        users.name,
        users.email,
        tasks.id AS task_id,
        tasks.title, 
        tasks.completed
      FROM users
      LEFT JOIN tasks
      ON users.id = tasks.user_id
      WHERE users.id = $1
    `, [id]);

    if (result.rows.length === 0 ) {
      return res.status(404).json({
        message: "User not found."
      });
    }

    return res.status(200).json(result.rows);

  } catch(error) {
    next(error)
  }
}