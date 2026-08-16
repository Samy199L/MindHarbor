import type { Role } from "@prisma/client";
declare global {
  namespace Express {
    interface Request {
      user?: { id: int; role: Role };
    }
  }
}
export {};
