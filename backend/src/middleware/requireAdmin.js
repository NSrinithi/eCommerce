import { AppError } from "../utils/AppError.js";

export function requireAdmin(req, _res, next) {
    if (!req.user) {
        throw new AppError(
            401,
            "Authentication required.",
            "UNAUTHENTICATED"
        );
    }

    if (req.user.role !== "ADMIN") {
        throw new AppError(
            403,
            "Admin access required.",
            "FORBIDDEN"
        );
    }

    next();
}