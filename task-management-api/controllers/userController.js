//import pool from "../db_conn.js";
import prisma from "../prisma_db.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
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
        password: hashedPassword,
        role: "user"
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    return res.status(201).json({
      message: "User registered successfully.",
      user
    });

  } catch (error) {
      if (error.code === "P2002") {
        return res.status(409).json({
          message: "Email already registered."
        });
      }

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

    // Generate short-lived access token
    const accessToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Generate cryptographically secure refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex");

    // Hash refresh token before storing it
    const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    // Set refresh token expiry to 7 days
    const refreshTokenExpiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    // Store hashed refresh token in PostgreSQL
    await prisma.refresh_tokens.create({
      data: {
        token_hash: tokenHash,
        user_id: user.id,
        expires_at: refreshTokenExpiresAt
      }
    });

    // Send refresh token through HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/users"
    });

    return res.status(200).json({
      message: "Login successful.",
      token: accessToken,
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
    const id = req.user.id;

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

    const result = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      tasks: user.tasks
    };

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

/*export const adminTest = (req, res) => {
  const { role } = req.user.role

  return res.status(200).json({
    "message": "Welcome Admin!"
  })
}*/

export const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token required."
      });
    }

    const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const storedToken = await prisma.refresh_tokens.findUnique({
      where: { token_hash: tokenHash }
    });

    if ( !storedToken || storedToken.revoked || storedToken.expires_at <= new Date()) {
      return res.status(401).json({
        message: "Invalid or expired refresh token."
      });
    }

    // Generate a new refresh token
    const newRefreshToken = crypto.randomBytes(64).toString("hex");

    const newTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");

    const newExpiry = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    // Revoke old token and store new token atomically
    const rotated = await prisma.$transaction(async (tx) => {
      const result = await tx.refresh_tokens.updateMany({
        where: {
          id: storedToken.id,
          revoked: false,
          expires_at: {
            gt: new Date()
          }
        },
        data: {
          revoked: true
        }
      });

      if (result.count !== 1) {
        return false;
      }

      await tx.refresh_tokens.create({
        data: {
          token_hash: newTokenHash,
          user_id: storedToken.user_id,
          expires_at: newExpiry
        }
      });

      return true;
    });

    if (!rotated) {
      return res.status(401).json({
        message: "Invalid or expired refresh token."
      });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { id: storedToken.user_id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Replace old cookie with new refresh token
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/users"
    });

    return res.status(200).json({
      message: "Access token refreshed successfully.",
      token: accessToken
    });

  } catch (error) {
    next(error);
  }
};


export const logoutUser = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      // Hash the refresh token
      const tokenHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

      // Revoke the refresh token in the database
      await prisma.refresh_tokens.updateMany({
        where: {
          token_hash: tokenHash,
          revoked: false
        },
        data: {
          revoked: true
        }
      });
    }

    // Clear the refresh-token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/users"
    });

    res.clearCookie("csrfToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/users"
    });

    return res.status(200).json({
      message: "Logout successful."
    });

  } catch (error) {
    next(error);
  }
};