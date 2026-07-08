import { Router } from "express";
import { asyncHandlerFunction } from "../../../helper/asyncErrorHandler.js";
import { createCategory,updateCategory,deleteCategory } from "../../../controller/category/admin/admin.controller.js";
import { roleGuard } from "../../../middleware/rbac.js";
import { authenticate } from "../../../middleware/authenticate.js";
import { validateRequest } from "../../../middleware/vaildate.js";
import { createCategorySchema, updateCategorySchema} from "../../../helper/category.vaildation.js";
import { redisRateLimit } from "../../../middleware/ratelimit.js";

const router = Router();

router.use(authenticate);
router.use(roleGuard("ADMIN"));

router.post("/",validateRequest(createCategorySchema),redisRateLimit({windowSec:60,max:5,prefix:"createcategory"}),asyncHandlerFunction(createCategory));

router.patch("/:categoryId",validateRequest(updateCategorySchema),redisRateLimit({windowSec:60,max:10,prefix:"updatecategory"}),asyncHandlerFunction(updateCategory));

router.delete("/:categoryId",redisRateLimit({windowSec:60,max:3,prefix:"deletecateogory"}),asyncHandlerFunction(deleteCategory));

export default router;