import type { Request, Response, NextFunction } from "express";
import {
  registerUser,
  tokenRefresh,
  loginUser,
  logoutUser,
  getUser,
} from "../services/auth.service.js";

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

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    const accessToken = await tokenRefresh(refreshToken);
    res.status(201).json({ accessToken });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    await logoutUser(refreshToken);
    res.status(204).send;
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await getUser(req.user!.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
}
