import { Router } from "express";

import { getDashboard } from "../controllers/admin.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

router.get(
    "/dashboard",
    requireAuth,
    requireAdmin,
    getDashboard
);

export default router;