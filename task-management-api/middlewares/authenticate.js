import jwt from "jsonwebtoken";
import prisma from "../prisma_db.js";

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required."
    });
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  
  try {
    decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token."
    });
  }

  try {
    const user = await prisma.users.findUnique({
      where: {
        id: decoded.id
      },
      select: {
        id: true,
        role: true
      }
    });

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists."
      });
    }

    req.user = user;

    next();

  } catch (error) {
    next(error);
  }
};

export default authenticate;