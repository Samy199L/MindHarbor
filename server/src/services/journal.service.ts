import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../middlewares/error.js";
import type {
  entreeCreerInput,
  entreeUpdateInput,
} from "../schemas/journal.schema.js";
//normaliser date a minuit(1entree par date)
function minuit(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}
//url:str -> date
function parseDate(dateStr: string): Date {
  return minuit(new Date(dateStr));
}

export async function creerEntree(userId: number, data: entreeCreerInput) {
  const today = minuit(new Date());
  const { activiteeId, ...entryData } = data;
  try {
    return await prisma.$transaction(async (tx) => {
      const cree = await tx.journalEntry.create({
        data: { ...entryData, date: today, userId },
      });
      if (activiteeId && activiteeId.length > 0) {
        await tx.journalActivity.createMany({
          data: activiteeId.map((actId) => ({
            entreeId: cree.id,
            activiteeId: actId,
            userId,
          })),
        });
      }
      return cree;
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      throw new AppError(
        409,
        "CONFLIT",
        "Une entree existe deja pour aujourd'hui",
      );
    }
    throw err;
  }
}

export async function listEntree(userId: number, page: number, limit: number) {
  const [data, total] = await prisma.$transaction([
    prisma.journalEntry.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.journalEntry.count({ where: { userId } }),
  ]);
  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function entreeParDate(userId: number, dateStr: string) {
  const date = parseDate(dateStr);
  const entree = await prisma.journalEntry.findFirst({
    where: { userId, date },
  });

  if (!entree) {
    throw new AppError(
      404,
      "NOT_FOUND",
      "Il ne semble pas avoir d'entree a cet date",
    );
  }
  return entree;
}

export async function updateEntree(
  userId: number,
  dateStr: string,
  data: entreeUpdateInput,
) {
  const date = parseDate(dateStr);
  const today = minuit(new Date());

  const existe = await prisma.journalEntry.findFirst({
    where: { userId, date },
  });
  if (!existe) {
    throw new AppError(
      404,
      "NOT_FOUND",
      "Il ne semble pas avoir d'entree a cet date",
    );
  }
  if (date.getTime() !== today.getTime()) {
    throw new AppError(
      403,
      "FORBIDDEN",
      "Cet entree ne peux pas etre modifier apres minuit.",
    );
  }
  const { activiteeId, ...entryData } = data;
  return prisma.journalEntry.update({
    where: { id: existe.id },
    data: entryData,
  });
}
const jour_range: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90 };
export async function tendenceEntree(userId: number, range: string) {
  const jour = jour_range[range] ?? 30;
  const depuis = minuit(new Date());
  depuis.setDate(depuis.getDate() - jour);

  const entrees = await prisma.journalEntry.findMany({
    where: { userId, date: { gte: depuis } },
    orderBy: { date: "asc" },
    select: {
      date: true,
      humeur: true,
      energie: true,
      sommeil: true,
      anxiete: true,
    },
  });
  return { evolution: entrees, seuilMinimalAtteint: entrees.length >= 5 };
}

export async function insightEntree(userId: number) {
  const activite = await prisma.activity.findFirst();
  if (!activite) return { observation: [], seuilMinimalAtteint: false };

  const avecActivite = await prisma.journalEntry.findMany({
    where: { userId, activitee: { some: { activiteeId: activite.id } } },
    select: { anxiete: true },
  });
  const sansActivite = await prisma.journalEntry.findMany({
    where: { userId, activitee: { none: { activiteeId: activite.id } } },
    select: { anxiete: true },
  });

  if (avecActivite.length < 5 || sansActivite.length < 5) {
    return { observation: [], seuilMinimalAtteint: false };
  }

  const moyenneAvec =
    avecActivite.reduce((s, e) => s + e.anxiete, 0) / avecActivite.length;
  const moyenneSans =
    sansActivite.reduce((s, e) => s + e.anxiete, 0) / sansActivite.length;
  const diffPourcent = Math.round(
    ((moyenneSans - moyenneAvec) / moyenneSans) * 100,
  );

  return {
    observation: [
      `les jour avec l'activitee ${activite.titre}, votre anxiete est en moyenne ${Math.abs(diffPourcent)}% ${diffPourcent > 0 ? "plus basse" : "plus elevee"}`,
    ],
    seuilMinimalAtteint: true,
  };
}
