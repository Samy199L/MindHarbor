import * as z from "zod";

const note = z.number().int().min(1).max(5);

export const entreeJournalSchema = z.object({
  humeur: note,
  energie: note,
  sommeil: note,
  anxiete: note,
  evenementMarquant: z.string().optional(),
  gratitude: z.string().optional(),
  activiteeId: z.array(z.number().int()).optional(),
});

export const dateParamSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "format AAAA-MM-JJ"),
});

export const statsSchema = z.object({
  range: z.enum(["7d", "30d", "90d"]),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const updateJournalSchema = entreeJournalSchema.partial();

export type entreeCreerInput = z.infer<typeof entreeJournalSchema>;

export type entreeUpdateInput = z.infer<typeof updateJournalSchema>;
