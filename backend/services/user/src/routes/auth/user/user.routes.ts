import { Router } from "express";
import { asyncHandlerFunction } from "../../../util/asycnHandler.js";
import { changePassword, login, logoutUser, regiseter, resetPassword, sendEmailVerifictionCode, sendResetPasswordCode, verifyEmail } from "../../../controller/auth/user/auth.js";
import { validateRequest } from "../../../middleware/vaildition.js";
import { changePasswordSchema, loginSchema, registerSchema, resetPasswordSchema, sendResetPasswordCodeSchema, verifyEmailSchema } from "../../../helper/vaildition.js";
import { authenticate } from "../../../middleware/authenticate.js";
import { redisRateLimit } from "../../../middleware/ratelimter.js";


const router =Router();

router.post("/register",[validateRequest(registerSchema),redisRateLimit({windowSec:15*60,max:5,prefix:"register"})],asyncHandlerFunction(regiseter));
router.post("/login",[validateRequest(loginSchema),redisRateLimit({windowSec:15*60,max:5,prefix:"login"})],asyncHandlerFunction(login));
router.post("/logout",redisRateLimit({windowSec:60,max:30,prefix:"logout"}),asyncHandlerFunction(logoutUser));
router.post("/send-verifiction-email-code",[authenticate,redisRateLimit({windowSec:10*60,max:5,prefix:"SendVerifictioncode"})],asyncHandlerFunction(sendEmailVerifictionCode));
router.post("/verify-email",[authenticate,validateRequest(verifyEmailSchema),redisRateLimit({windowSec:10*60,max:5,prefix:"verifyemail"})],asyncHandlerFunction(verifyEmail));
router.post("/send-reset-password-code",[validateRequest(sendResetPasswordCodeSchema),redisRateLimit({windowSec:15*60,max:3,prefix:"sendresetcode"})],asyncHandlerFunction(sendResetPasswordCode));
router.post("/reset-password",[validateRequest(resetPasswordSchema),redisRateLimit({windowSec:15*60,max:3,prefix:"resetpassword"})],asyncHandlerFunction(resetPassword));
router.post("/change-password",[authenticate,validateRequest(changePasswordSchema),redisRateLimit({windowSec:10*60,max:5,prefix:"changepassword"})],asyncHandlerFunction(changePassword));

export default router;