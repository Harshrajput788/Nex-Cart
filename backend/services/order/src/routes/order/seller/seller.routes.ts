import { Router } from "express";
import { asyncHandlerFunction } from "../../../service/asynchandller.js";
import { authenticate } from "../../../middleware/authenticate.js";
import { authorize } from "../../../middleware/rbac.js";
import { getSellerOrders, updateSellerItemStatus,cancelSellerItem,getSellerOrderById,getSellerMonthlyAnalytics } from "../../../controller/order/seller/seller.controller.js";
import { redisRateLimit } from "../../../middleware/ratelimiter.js";

const router = Router();

router.use(authenticate);
router.use(authorize(["SELLER"]));

router.get("/all", redisRateLimit({windowSec: 60, max: 40, prefix: "seller-orders"}), asyncHandlerFunction(getSellerOrders));
router.get("/analytics",redisRateLimit({windowSec:60,max:40,prefix:"seller-analytics"}),asyncHandlerFunction(getSellerMonthlyAnalytics))
router.get("/:orderId", redisRateLimit({windowSec: 60, max: 80, prefix: "seller-order-details"}), asyncHandlerFunction(getSellerOrderById));
router.patch("/:orderId", redisRateLimit({windowSec: 60, max: 20, prefix: "seller-order-status"}), asyncHandlerFunction(updateSellerItemStatus));
router.post("/:orderId/cancel-item", redisRateLimit({windowSec: 60, max: 10, prefix: "seller-order-cancel"}), asyncHandlerFunction(cancelSellerItem));

export default router;