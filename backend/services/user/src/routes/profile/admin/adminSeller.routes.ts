import { Router } from "express";
import { authenticate, } from "../../../middleware/authenticate.js";
import { roleGuard } from "../../../middleware/rbac.js";
import { redisRateLimit } from "../../../middleware/ratelimter.js";
import { asyncHandlerFunction } from "../../../util/asycnHandler.js";
import { getAllSellers } from "../../../controller/profile/admin/admin.controller.js";

const router = Router();

router.get("/",[authenticate,roleGuard("ADMIN"),redisRateLimit({windowSec:60,max:120,prefix:"getsellerbyadmin"})],asyncHandlerFunction(getAllSellers));

export default router;