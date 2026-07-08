import express from 'express';
import cors from 'cors'
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import authUserRouter from './routes/auth/user/user.routes.js'
import addressUserRouter from './routes/address/user.routes.js'
import userProfileRouter from './routes/profile/user/user.routes.js';
import adminProfileRouter from './routes/profile/admin/admin.routes.js'
import adminSellerProfileRouter from "./routes/profile/admin/adminSeller.routes.js"

const app = express();
 
const allowOrigin = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : ["http://localhost:5173"]

app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin:allowOrigin,
  credentials: true
}));
app.use(cookieParser());

app.get("/health", (_, res) => {

    res.status(200).json({
        success: true,
        status: "UP",
        timestamp: new Date().toISOString()
    });
});
//Auth routes 
app.use("/auth", authUserRouter);

//User profile routes

app.use("/profile", userProfileRouter);

//Address routes

app.use("/address", addressUserRouter);

//Admin user profile handle routes

app.use("/admin/profile", adminProfileRouter);

//Admin seller profile handle 

app.use("/admin/seller", adminSellerProfileRouter);

export default app;