import { Router } from "express";
import { asyncHandlerFunction } from "../../../helper/asyncErrorHandler.js";
import { authenticate } from "../../../middleware/authenticate.js";
import { roleGuard } from "../../../middleware/rbac.js";
import { validateRequest } from "../../../middleware/vaildate.js";
import { createVariantSchema, updateVariantSchema, updateVariantStatusSchema, updateVariantStockSchema } from "../../../helper/variant.vaildtion.js";
import { createVariant, deleteVariant, updateVariant, updateVariantStatus, updateVariantStock } from "../../../controller/variant/seller/seller.controller.js";
import { redisRateLimit } from "../../../middleware/ratelimit.js";


const router = Router();

router.use(authenticate,roleGuard('SELLER','ADMIN'));

router.post("/:productId",[validateRequest(createVariantSchema),redisRateLimit({windowSec:10*60, max: 10,prefix: "variant:seller:post"})],asyncHandlerFunction(createVariant));
router.patch("/:variantId",[validateRequest(updateVariantSchema),redisRateLimit({windowSec: 60, max: 25,prefix: "variant:seller:patch"})],asyncHandlerFunction(updateVariant));
router.patch("/:variantId/stock",[validateRequest(updateVariantStockSchema),redisRateLimit({windowSec: 60, max: 20,prefix: "variant:seller:patchStock"})],asyncHandlerFunction(updateVariantStock));
router.patch("/:variantId/status",[validateRequest(updateVariantStatusSchema),redisRateLimit({windowSec: 60*5, max: 15,prefix: "variant:seller:patchStatus"})],asyncHandlerFunction(updateVariantStatus));
router.delete("/:variantId",[redisRateLimit({windowSec: 60*10, max: 10,prefix: "variant:admin:delete"})],asyncHandlerFunction(deleteVariant));

export default router;