import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { loginService } from "../services/auth.service";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await loginService(email, password);

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const payload = {
    id: user.id,
    email: user.email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  return res.json({
    token,
  });
}