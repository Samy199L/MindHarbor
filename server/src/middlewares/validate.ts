import type { RequestHandler } from "express";
import type { ZodSchema } from "zod";
import { AppError } from "./error.js";

export const validateBody =
  (schema: ZodSchema): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details = result.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      }));
      return next(
        new AppError(422, "VALIDATION_ERROR", "Donnees invalides.", details),
      );
    }
    req.body = result.data; // req.body est desormais valide et nettoye
    next();
  };

export const validateParams =
  (schema: ZodSchema): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      const details = result.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      }));
      return next(
        new AppError(422, "VALIDATION_ERROR", "Donnees invalides.", details),
      );
    }
    req.params = result.data as typeof req.params;
    next();
  };

export const validateQuery =
  (schema: ZodSchema): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const details = result.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      }));
      return next(
        new AppError(422, "VALIDATION_ERROR", "Donnees invalides.", details),
      );
    }
    req.query = result.data as typeof req.query; // req.body est desormais valide et nettoye
    next();
  };
