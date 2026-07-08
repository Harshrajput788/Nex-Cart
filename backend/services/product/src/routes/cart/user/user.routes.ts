import { Router } from "express";
import { asyncHandlerFunction } from "../../../helper/asyncErrorHandler.js";
import { getMyCart,addItemToCart,updateCartItemQuantity,removeCartItem,clearCart } from "../../../controller/cart/user/user.controller.js";
import { authenticate } from "../../../middleware/authenticate.js";
import { redisRateLimit } from "../../../middleware/ratelimit.js";

const router = Router();

router.use(authenticate);

router.get("/",redisRateLimit({windowSec: 60, max: 30,prefix: "cart:get"}),asyncHandlerFunction(getMyCart));
router.post("/",redisRateLimit({windowSec: 60, max: 20,prefix: "cart:post"}),asyncHandlerFunction(addItemToCart));
router.patch("/:itemId",redisRateLimit({windowSec: 60, max: 25,prefix: "cart:patch"}),asyncHandlerFunction(updateCartItemQuantity));
router.delete("/:itemId",redisRateLimit({windowSec: 60, max: 15,prefix: "cart:delete"}),asyncHandlerFunction(removeCartItem));
router.delete("/clear/myCart",redisRateLimit({windowSec: 60*5, max: 5,prefix: "cart:clear"}),asyncHandlerFunction(clearCart));

export default router;