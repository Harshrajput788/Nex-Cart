import { Router } from "express";
import { asyncHandlerFunction } from "../../../helper/asyncErrorHandler.js";
import { createProduct, deleteProduct, getProductsbySeller, updateProduct, updateProductStatus, updateProductStock, uploadProductImagesById } from "../../../controller/product/seller/seller.controller.js";
import { authenticate } from "../../../middleware/authenticate.js";
import { roleGuard } from "../../../middleware/rbac.js";
import { upload } from "../../../middleware/multer.js";
import { validateRequest } from "../../../middleware/vaildate.js";
import { createProductSchema, updateProductSchema, updateProductStockSchema } from "../../../helper/product.vaildation.js";
import { redisRateLimit } from "../../../middleware/ratelimit.js";

const router = Router();

router.use(authenticate);
router.use(roleGuard("ADMIN","SELLER"));

router.get("/",[redisRateLimit({windowSec: 60, max: 60,prefix: "product:seller:get"})],asyncHandlerFunction(getProductsbySeller));

router.post("/",[validateRequest(createProductSchema),upload.array("Images",6),],redisRateLimit({windowSec: 60*10, max: 5,prefix: "product:seller:post"}),asyncHandlerFunction(createProduct));

router.post("/update-product-image/:productId",[redisRateLimit({windowSec: 60*10, max: 5,prefix: "product:seller:postImages"}),upload.array("Images",6)],asyncHandlerFunction(uploadProductImagesById));

router.patch("/:productId",[validateRequest(updateProductSchema),redisRateLimit({windowSec: 60, max: 20,prefix: "product:seller:patch"})],asyncHandlerFunction(updateProduct));

router.patch("/update-stock/:productId",[validateRequest(updateProductStockSchema),redisRateLimit({windowSec: 60, max: 15,prefix: "product:seller:patchStock"})],asyncHandlerFunction(updateProductStock));

router.patch("/update-status/:productId",[redisRateLimit({windowSec: 5*60, max: 10,prefix: "product:seller:patchStatus"})],asyncHandlerFunction(updateProductStatus));

router.delete("/:productId",[redisRateLimit({windowSec: 60*5, max: 10,prefix: "product:seller:delete"})],asyncHandlerFunction(deleteProduct));

export default router;