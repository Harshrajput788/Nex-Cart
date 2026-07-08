import { Router } from "express";
import { asyncHandlerFunction } from "../../../helper/asyncErrorHandler.js";
import { redisRateLimit } from "../../../middleware/ratelimit.js";
import { getCategoryById,getAllCategories, getProductsByCategory } from "../../../controller/category/user/user.controller.js";

const router = Router();

router.get("/",redisRateLimit({windowSec:60,max:60,prefix:"readallcategory"}),asyncHandlerFunction(getAllCategories));
router.get("/:id",redisRateLimit({windowSec:60,max:60,prefix:"readcategorybyid"}),asyncHandlerFunction(getCategoryById));
router.get("/:categoryId/products",redisRateLimit({windowSec:60,max:60,prefix:"getproductbycategory"}),asyncHandlerFunction(getProductsByCategory));

export default router;