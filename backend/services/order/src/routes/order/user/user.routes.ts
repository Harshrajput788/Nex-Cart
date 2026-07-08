import { Router } from "express";
import { getMyOrders,getOrderById,createOrder,trackOrder,cancelOrder } from "../../../controller/order/user/user.controller.js";
import { authenticate } from "../../../middleware/authenticate.js";
import { asyncHandlerFunction } from "../../../service/asynchandller.js";
import { redisRateLimit } from "../../../middleware/ratelimiter.js";

const router = Router();

router.use(authenticate);

router.get("/my-orders",redisRateLimit({windowSec:60, max: 30,prefix: "user-orders"}), asyncHandlerFunction(getMyOrders));
router.get("/:orderId", redisRateLimit({windowSec:60, max: 60,prefix: "user-order-details"}), asyncHandlerFunction(getOrderById));
router.post("/", redisRateLimit({windowSec:60, max: 5,prefix: "user-create-order"}), asyncHandlerFunction(createOrder));
router.get("/:orderId/track", redisRateLimit({windowSec:60, max: 20,prefix: "user-track-order"}), asyncHandlerFunction(trackOrder));
router.post("/:orderId/cancel", redisRateLimit({windowSec:60, max: 3,prefix: "user-cancel-order"}), asyncHandlerFunction(cancelOrder));

export default router;