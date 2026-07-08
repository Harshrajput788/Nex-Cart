import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate.js";
import { roleGuard } from "../../../middleware/rbac.js";
import { asyncHandlerFunction } from "../../../helper/asyncErrorHandler.js";
import { updateProductByAdmin,updateProductStatusbyAdmin,approveProduct,getAllProduct,deleteProductByAdmin } from "../../../controller/product/admin/admin.controller.js";
import { redisRateLimit } from "../../../middleware/ratelimit.js";
import { validateRequest } from "../../../middleware/vaildate.js";
import { updateProductSchema } from "../../../helper/product.vaildation.js";

const router = Router();

router.use(authenticate,roleGuard('ADMIN'));

router.get("/all",redisRateLimit({windowSec: 60, max: 60,prefix: "product:admin:get"}),asyncHandlerFunction(getAllProduct))

router.patch("/:productId",[validateRequest(updateProductSchema),redisRateLimit({windowSec: 60, max: 20,prefix: "product:admin:patch"})],asyncHandlerFunction(updateProductByAdmin));

router.patch("/aroval-product/:productId",redisRateLimit({windowSec: 60*5, max: 20,prefix: "product:admin:patch"}),asyncHandlerFunction(approveProduct));

router.patch("/status/:productId",redisRateLimit({windowSec: 60*5, max: 20,prefix: "product:admin:patchStatus"}),asyncHandlerFunction(updateProductStatusbyAdmin));

router.delete("/:productId",[redisRateLimit({windowSec: 60*5, max: 10,prefix: "product:admin:delete"})],asyncHandlerFunction(deleteProductByAdmin));


export default router;