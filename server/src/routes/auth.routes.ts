import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import * as authController from "../controllers/auth.controller.js";
import { validateBody } from "../middlewares/validate.js";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  logoutSchema,
} from "../schemas/auth.schema.js";

const router = Router();

router.post("/register", validateBody(registerSchema), authController.register);
router.post("/login", validateBody(loginSchema), authController.login);
router.post("/refresh", validateBody(refreshSchema), authController.refresh);
router.post(
  "/logout",
  requireAuth,
  validateBody(logoutSchema),
  authController.logout,
);
router.get("/me", requireAuth, authController.getMe);

export default router;
