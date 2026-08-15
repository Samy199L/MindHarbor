import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { Prisma, type Role } from "@prisma/client";
import { AppError } from "../middlewares/error.js";
import "dotenv/config";

export async function registerUser(
  nom: string,
  email: string,
  username: string,
  password: string,
) {
  try {
    const pass_hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, nom, username, password: pass_hash },
    });
    return user;
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      throw new AppError(
        409,
        "CONFLIT",
        "Ce courielle ou nomd'utilisasteur existe deja",
      );
    }
    throw err;
  }
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user)
    throw new AppError(
      401,
      "INVALIDE",
      "Desolee, cet utilisateur est introuvable",
    );

  const ok = await bcrypt.compare(password, user.password);
  if (!ok)
    throw new AppError(
      401,
      "INVALIDE",
      "Desolee,ce mot de passe semble incorect",
    );

  const refreshToken = jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" },
  );
  const accessToken = jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: "15m" },
  );

  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id },
  });
  return { refreshToken, accessToken };
}
