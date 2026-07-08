import express from 'express';
import cors from 'cors'
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import userOrderRouter from './routes/order/user/user.routes.js';
import sellerOrderRouter from './routes/order/seller/seller.routes.js';
import paymentRouter from "./routes/paymet/payment.routes.js"
import adminOrderRouter from './routes/order/admin/admin.routes.js'

const app = express();

const allowedOrigins = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : ["http://localhost:5173"];


app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: allowedOrigins }));
app.use(cookieParser());

app.get("/health", (_, res) => {
    res.status(200).json({
        success: true,
        status: "UP",
        timestamp: new Date().toISOString()
    });
});

app.use("/", userOrderRouter);
app.use("/seller", sellerOrderRouter);
app.use("/admin", adminOrderRouter);

app.use("/payment", paymentRouter);


export default app;