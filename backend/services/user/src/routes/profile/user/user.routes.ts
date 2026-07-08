import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate.js";
import { asyncHandlerFunction } from "../../../util/asycnHandler.js";
import { deleteUser, getUserProfile, updateUserProfile } from "../../../controller/profile/user/user.controller.js";
import { validateRequest } from "../../../middleware/vaildition.js";
import { updateProfileSchema } from "../../../helper/vaildition.js";
import { redisRateLimit } from "../../../middleware/ratelimter.js";

const router = Router();

router.get("/",[authenticate,redisRateLimit({windowSec:60,max:60,prefix:"readprofile"})],asyncHandlerFunction(getUserProfile));
router.patch("/",[authenticate,validateRequest(updateProfileSchema),redisRateLimit({windowSec:10*60,max:10,prefix:"updateprofile"})],asyncHandlerFunction(updateUserProfile));
router.delete('/',[authenticate,redisRateLimit({windowSec:60*60,max:3,prefix:"deleteProfile"})],asyncHandlerFunction(deleteUser))

export default router;