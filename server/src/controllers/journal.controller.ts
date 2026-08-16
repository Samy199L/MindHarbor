import type { Request, Response, NextFunction } from "express";
import * as journalService from "../services/journal.service.js";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const entree = await journalService.creerEntree(req.user!.id, req.body);
    res.status(201).json(entree);
  } catch (err) {
    next(err);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const result = await journalService.listEntree(req.user!.id, page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function parDate(
  req: Request<{ date: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const entree = await journalService.entreeParDate(
      req.user!.id,
      req.params.date,
    );
    res.json(entree);
  } catch (err) {
    next(err);
  }
}

export async function update(
  req: Request<{ date: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const entree = await journalService.updateEntree(
      req.user!.id,
      req.params.date,
      req.body,
    );
    res.json(entree);
  } catch (err) {
    next(err);
  }
}

export async function stats(req: Request, res: Response, next: NextFunction) {
  try {
    const range = (req.query.range as string) ?? "30d";
    const result = await journalService.tendenceEntree(req.user!.id, range);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function insight(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await journalService.insightEntree(req.user!.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
