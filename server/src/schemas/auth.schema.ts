import * as z from "zod";

export const registerSchema = z.object({
  nom: z.string().min(3),
  email: z.email(),
  username: z.string().min(2),
  password: z.string().min(8).regex(/[A-Z]/).regex(/\d/),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/\d/),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, "refreshToken requis"),
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(1, "refreshToken inexistant"),
});
