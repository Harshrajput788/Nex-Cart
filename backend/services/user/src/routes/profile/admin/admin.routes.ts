import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate.js";
import { roleGuard } from "../../../middleware/rbac.js";
import { asyncHandlerFunction } from "../../../util/asycnHandler.js";
import { getUserById,getAllUsers, updateUserByAdmin, deleteUserByAdmin } from "../../../controller/profile/admin/admin.controller.js";
import { validateRequest } from "../../../middleware/vaildition.js";
import { updateUserByAdminSchema } from "../../../helper/vaildition.js";
import { redisRateLimit } from "../../../middleware/ratelimter.js";

const router = Router();

router.get("/all",[authenticate,roleGuard("ADMIN"),redisRateLimit({windowSec:60,max:120,prefix:"getUsersbyadmin"})],asyncHandlerFunction(getAllUsers));
router.get("/:id",[authenticate,roleGuard("ADMIN"),redisRateLimit({windowSec:60,max:120,prefix:"getUserbyIdbyadmin"})],asyncHandlerFunction(getUserById));
router.patch("/:userId",[authenticate,roleGuard("ADMIN"),validateRequest(updateUserByAdminSchema),redisRateLimit({windowSec:60*10,max:30,prefix:"updateuserbyadmin"})],asyncHandlerFunction(updateUserByAdmin));
router.delete("/:userId",[authenticate,roleGuard("ADMIN"),redisRateLimit({windowSec:60*60,max:10,prefix:"deleteuserbyadmin"})],asyncHandlerFunction(deleteUserByAdmin));


export default router;
