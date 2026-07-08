import type { Request,Response,NextFunction } from "express";
import type { JwtPayload } from "jsonwebtoken";

export type UserRole = "ADMIN" | "SELLER" | "USER"

export const roleGuard =
  (...allowedRoles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({
        success: false,
        message: "Access denied"
      });
      return;
    }

    next();
  };