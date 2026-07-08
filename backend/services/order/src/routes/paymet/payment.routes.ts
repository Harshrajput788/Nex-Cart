import {Router} from 'express';
import {createPayment,validatePayment} from '../../controller/payment/payment.controller.js';
import {asyncHandlerFunction} from "../../service/asynchandller.js"
import { authenticate } from '../../middleware/authenticate.js';
import {authorize} from '../../middleware/rbac.js'
import {redisRateLimit} from '../../middleware/ratelimiter.js'
import {paymentValidation,validatePaymentSchema} from '../../service/payment.vaildtion.js'
import {validateRequest} from '../../middleware/vaildtion.js'

const router = Router();

router.use(authenticate);
router.use(authorize(['SELLER', 'USER']));

router.post("/create-payment-gateway",[redisRateLimit({windowSec:60, max: 5,prefix: "create-payment-order"}),validateRequest({ body: paymentValidation })],asyncHandlerFunction(createPayment));
router.post("/validate-payment",[redisRateLimit({windowSec:60, max: 5,prefix: "validate-payment-order"}),validateRequest({ body: validatePaymentSchema })],asyncHandlerFunction(validatePayment));

export default router;