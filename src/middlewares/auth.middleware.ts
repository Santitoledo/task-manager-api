import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const token = parts[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(
  token,
  process.env.JWT_SECRET!
);

if (typeof decoded === "string") {
  return res.status(401).json({
    message: "Unauthorized",
  });
}

req.user = {
  id: decoded.id,
  email: decoded.email,
  role: decoded.role,
};

next();
  } catch {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
}