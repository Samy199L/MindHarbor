import type { Request, Response, NextFunction } from "express";
import { registerUser } from "../services/auth.service.js";
import { loginUser } from "../services/auth.service.js";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { nom, email, username, password } = req.body;
    const user = await registerUser(nom, email, username, password);
    res.status(201).json({ id: user.id, email: user.email, role: user.role });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
