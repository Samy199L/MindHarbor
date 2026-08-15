import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import * as authController from "../controllers/auth.controller.js";
import { validateBody } from "../middlewares/validate.js";
import { registerSchema } from "../schema/auth.schema.js";
const router = Router();

router.post("/register", validateBody(registerSchema), authController.register);
router.post("/login", validateBody(registerSchema), authController.login);
