import * as z from "zod";

export const registerSchema = z.object({
  nom: z.string().min(3),
  email: z.email(),
  username: z.string().min(2),
  password: z.string().min(8).regex(/[A-Z]/).regex(/\d/),
});
