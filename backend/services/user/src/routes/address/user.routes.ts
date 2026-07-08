import { Router } from "express";
import { asyncHandlerFunction } from "../../util/asycnHandler.js";
import { authenticate } from "../../middleware/authenticate.js";
import {  createAddressSchema, updateAddressSchema } from "../../helper/addressVaildtion.js";
import { createAddress, deleteAddress, getAddress, updateAddress } from "../../controller/address/user.controller.js";
import { validateRequest } from "../../middleware/vaildition.js";
import { redisRateLimit } from "../../middleware/ratelimter.js";

const router = Router();

router.get("/",[authenticate,redisRateLimit({windowSec:10,max:60,prefix:"getAddress"})],asyncHandlerFunction(getAddress));
router.post("/",[authenticate,validateRequest(createAddressSchema),redisRateLimit({windowSec:10*60,max:10,prefix:"addaddress"})],asyncHandlerFunction(createAddress));
router.patch("/:id",[authenticate,validateRequest(updateAddressSchema),redisRateLimit({windowSec:10*60,max:10,prefix:"upateaddreess"})],asyncHandlerFunction(updateAddress));
router.delete("/:id",[authenticate,redisRateLimit({windowSec:10*60,max:10,prefix:"deleteaddress"})],asyncHandlerFunction(deleteAddress));

export default router;