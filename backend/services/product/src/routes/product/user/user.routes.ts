import { Router } from "express";
import { redisRateLimit } from "../../../middleware/ratelimit.js";
import { asyncHandlerFunction } from "../../../helper/asyncErrorHandler.js";
import { getProductbyId,getProducts } from "../../../controller/product/user/user.controller.js";

const router = Router();

router.get("/all",redisRateLimit({windowSec: 60, max: 120,prefix: "product:get"}),asyncHandlerFunction(getProducts));
router.get("/byId/:productId",redisRateLimit({windowSec: 100, max: 60,prefix: "product:getById"}),asyncHandlerFunction(getProductbyId));
 
export default router;