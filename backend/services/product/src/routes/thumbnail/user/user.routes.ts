import { Router } from "express";
import { asyncHandlerFunction } from "../../../helper/asyncErrorHandler.js";
import { getThumbnails ,getThumbnailById} from "../../../controller/thumbnail/user/user.controller.js";

const router = Router();

router.get("/", asyncHandlerFunction(getThumbnails));
router.get("/byId/:id", asyncHandlerFunction(getThumbnailById));

export default router;