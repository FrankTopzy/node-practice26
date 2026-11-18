//import pool from "../db_conn.js";
import prisma from "../prisma_db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check whether the email is already registered
    const existingUser = await prisma.users.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered."
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user
    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    return res.status(201).json({
      message: "User registered successfully.",
      user
    });

  } catch (error) {
    next(error);
  }
};



export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.users.findUnique({
      where: { email }
    });

    if (!user || !user.password) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    // Compare submitted password with stored hash
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    next(error);
  }
};

export const getUserTasks = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if(!Number.isInteger(id) || id <= 0 ) {
      return res.status(400).json({message: "Invalid user ID"});
    }

    const user = await prisma.users.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        name: true,
        email: true,
        tasks: {
          select: {
            id: true,
            title: true,
            completed: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'user not found.' });
    }

    const result = user.tasks.length > 0
    ? user.tasks.map((task) => ({
        user_id: user.id,
        name: user.name,
        email: user.email,
        task_id: task.id,
        title: task.title,
        completed: task.completed
      }))
    : [{
        user_id: user.id,
        name: user.name,
        email: user.email,
        task_id: null,
        title: null,
        completed: null
      }];


    /*const result = await pool.query(`
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
    }*/

    return res.status(200).json(result);

  } catch(error) {
    next(error)
  }
}