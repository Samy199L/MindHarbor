import { Router } from "express";
import * as journalController from "../controllers/journal.controller.js";
import { requireAuth } from "../middlewares/auth.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middlewares/validate.js";
import {
  entreeJournalSchema,
  updateJournalSchema,
  dateParamSchema,
  statsSchema,
  paginationSchema,
} from "../schemas/journal.schema.js";

const router = Router();

router.use(requireAuth);

router.get("/", validateQuery(paginationSchema), journalController.list);
router.post("/", validateBody(entreeJournalSchema), journalController.create);
router.get("/stats", validateQuery(statsSchema), journalController.stats);
router.get("/insight", journalController.insight);
router.get(
  "/:date",
  validateParams(dateParamSchema),
  journalController.parDate,
);
router.patch(
  "/:date",
  validateParams(dateParamSchema),
  validateBody(updateJournalSchema),
  journalController.update,
);

export default router;
