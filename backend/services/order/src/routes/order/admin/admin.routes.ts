import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate.js";
import { authorize } from "../../../middleware/rbac.js";
import { getAllOrders,getOrderAnalyticsAdmin,getOrderByIdAdmin,cancelOrderAdmin,refundOrderAdmin,updateOrderStatusAdmin, getMonthlySalesAnalytics } from "../../../controller/order/admin/admin.controller.js";
import { redisRateLimit } from "../../../middleware/ratelimiter.js";
import { asyncHandlerFunction } from "../../../service/asynchandller.js";

const router = Router();

router.use(authenticate);
router.use(authorize(["ADMIN"]));

router.get("/orders",redisRateLimit({windowSec:60, max: 30,prefix: "admin-orders"}),asyncHandlerFunction(getAllOrders));
router.get("/orders/analytics", redisRateLimit({windowSec:60, max: 10,prefix: "admin-analytics"}),asyncHandlerFunction(getOrderAnalyticsAdmin));
router.get("/orders/analytics/monthly-sell",redisRateLimit({windowSec:60,max:10,prefix:"admin-analytics-montly"}),asyncHandlerFunction(getMonthlySalesAnalytics));
router.get("/orders/:orderNumber", redisRateLimit({windowSec:60, max: 60,prefix: "admin-order-details"}),asyncHandlerFunction(getOrderByIdAdmin));
router.put("/orders/:orderNumber/status", redisRateLimit({windowSec:60, max: 15,prefix: "admin-order-status"}), asyncHandlerFunction(updateOrderStatusAdmin));
router.post("/orders/:orderId/cancel", redisRateLimit({windowSec:60, max: 5,prefix: "admin-order-cancel"}), asyncHandlerFunction(cancelOrderAdmin));
router.post("/orders/:orderId/refund", redisRateLimit({windowSec:60, max: 3,prefix: "admin-order-refund"}), asyncHandlerFunction(refundOrderAdmin));

export default router;