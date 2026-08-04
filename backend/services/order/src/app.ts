import express from 'express';
import cors from 'cors'
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import userOrderRouter from './routes/order/user/user.routes.js';
import sellerOrderRouter from './routes/order/seller/seller.routes.js';
import paymentRouter from "./routes/paymet/payment.routes.js"
import { connectDatabase } from "./config/db.js";
import adminOrderRouter from './routes/order/admin/admin.routes.js'
import { config } from "dotenv";

config();

const app = express();

const allowOrigin =  [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
].filter(Boolean);

app.use(async(req,res,next)=>{
  await connectDatabase();
  next();
})

app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
 origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (allowOrigin.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
}));
app.use(cookieParser());

app.use("/", userOrderRouter);
app.use("/seller", sellerOrderRouter);
app.use("/admin", adminOrderRouter);

app.use("/payment", paymentRouter);

app.get("/check/health", (_, res) => {
    res.status(200).json({
        success: true,
        status: "UP",
        message:"Done"
        allowOrigin:allowOrigin,
        timestamp: new Date().toISOString()
    });
});


export default app;
