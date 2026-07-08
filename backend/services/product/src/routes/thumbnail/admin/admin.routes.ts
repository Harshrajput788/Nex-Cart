import { Router } from "express";
import { createThumbnail,updateThumbnail,deleteThumbnail } from "../../../controller/thumbnail/admin/admin.controller.js";
import { asyncHandlerFunction } from "../../../helper/asyncErrorHandler.js";
import { authenticate } from "../../../middleware/authenticate.js";
import { roleGuard } from "../../../middleware/rbac.js";
import {  uploadSingle } from "../../../middleware/multer.js";
import { validateRequest } from "../../../middleware/vaildate.js";
import { createThumbnailSchema, updateThumbnailSchema } from "../../../helper/thumbnail.vaildtion.js";
import { redisRateLimit } from "../../../middleware/ratelimit.js";

const router = Router();

router.use(authenticate);
router.use(roleGuard("ADMIN"));

router.post("/", uploadSingle.single("thumbnail"),validateRequest(createThumbnailSchema),redisRateLimit({windowSec:60*15,max:10,prefix:"create-thumbnails-admin"}), asyncHandlerFunction(createThumbnail));
router.put("/:thumbnailId", uploadSingle.single("thumbnail"),validateRequest(updateThumbnailSchema),redisRateLimit({windowSec:60*15,max:20,prefix:"create-thumbnails-admin"}), asyncHandlerFunction(updateThumbnail));
router.delete("/:thumbnailId",redisRateLimit({windowSec:60*15,max:30,prefix:"create-thumbnails-admin"}), asyncHandlerFunction(deleteThumbnail));

export default router;