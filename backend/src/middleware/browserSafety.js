import { AppError } from "../utils/AppError.js";

export function browserSafety(config) {
    return (req, _res, next) => {
        if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
            return next();
        }

        // Required request header for non-GET requests
        if (req.get("X-App-Request") !== "mern-base") {
            throw new AppError(
                403,
                "Required request header is missing.",
                "CSRF_CHECK_FAILED"
            );
        }

        // Check origin
        const origin = req.get("Origin");

        if (
            origin &&
            !config.origins.includes(origin)
        ) {
            throw new AppError(
                403,
                "Origin is not allowed.",
                "ORIGIN_BLOCKED"
            );
        }

        // Allow both JSON requests and multipart/form-data uploads
        const contentLength = Number(
            req.get("Content-Length") || 0
        );

        if (contentLength > 0) {
            const isJson = req.is("application/json");
            const isMultipart = req.is("multipart/form-data");

            if (!isJson && !isMultipart) {
                throw new AppError(
                    415,
                    "Send application/json or multipart/form-data.",
                    "CONTENT_TYPE_REQUIRED"
                );
            }
        }

        next();
    };
}