import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate.js";
import { roleGuard } from "../../../middleware/rbac.js";
import { asyncHandlerFunction } from "../../../helper/asyncErrorHandler.js";
import { deactivateCart, getAllCart, getCartById, getCartByUserId } from "../../../controller/cart/admin/admin.controller.js";
import { redisRateLimit } from "../../../middleware/ratelimit.js";

const router =Router();

router.use(authenticate);
router.use(roleGuard('ADMIN','SELLER'));

router.get("/",redisRateLimit({windowSec: 60, max: 60,prefix: "cart:admin:get"}),asyncHandlerFunction(getAllCart));
router.get("/:cartId",redisRateLimit({windowSec: 60, max: 60,prefix: "cart:admin:getById"}),asyncHandlerFunction(getCartById));
router.get("/:userId",redisRateLimit({windowSec: 60, max: 50,prefix: "cart:admin:getByUserId"}),asyncHandlerFunction(getCartByUserId));
router.delete("/:cartId",redisRateLimit({windowSec: 60*5, max: 10,prefix: "cart:admin:delete"}),asyncHandlerFunction(deactivateCart));

export default router;