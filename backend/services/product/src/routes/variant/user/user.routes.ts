import { Router } from "express";
import { asyncHandlerFunction } from "../../../helper/asyncErrorHandler.js";
import { getVariantById, getVariantsByProduct } from "../../../controller/variant/user/user.controller.js";
import { getProductbyId } from "../../../controller/product/user/user.controller.js";
import { redisRateLimit } from "../../../middleware/ratelimit.js";


const router = Router();

router.get("/byProductId/:productId",redisRateLimit({windowSec: 60, max: 120,prefix: "variant:user:get"}),asyncHandlerFunction(getVariantsByProduct));
router.get("/:variantId",redisRateLimit({windowSec: 60, max: 100,prefix: "variant:user:getById"}),asyncHandlerFunction(getVariantById));

export default router;