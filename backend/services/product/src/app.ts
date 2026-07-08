import express from 'express';
import cors from 'cors'
import helmet from 'helmet';
import adminCategoryRouter from './routes/category/admin/admin.routes.js';
import userCategoryRouter from './routes/category/user/user.routes.js'
import cookieParser from 'cookie-parser';
import sellerProductRouter from './routes/product/seller/seller.routes.js'
import userProductRouter from './routes/product/user/user.routes.js'
import adminProductRouter from "./routes/product/admin/admin.routes.js" ;
import userVariantRouter from './routes/variant/user/user.routes.js';
import sellerVariantRouter from './routes/variant/seller/seller.routes.js'
import cartRouter from './routes/cart/user/user.routes.js'
import adminThumbnailRouter from "./routes/thumbnail/admin/admin.routes.js"
import userThumbnailRouter from "./routes/thumbnail/user/user.routes.js"
import adminCartRouter from './routes/cart/admin/admin.routes.js'

const app = express();

const allowedOrigins = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : ["http://localhost:5173"];

app.use(helmet());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cors({ credentials: true, origin: allowedOrigins }));
app.use(cookieParser());

app.get("/health", (_, res) => {
    res.status(200).json({
        success: true,
        status: "UP",
        timestamp: new Date().toISOString()
    });
});

//Category Routes

app.use("/category",userCategoryRouter);
app.use("/admin/category",adminCategoryRouter);

//Product Routes

app.use("/",userProductRouter);
app.use("/seller",sellerProductRouter);
app.use("/admin",adminProductRouter);

//Thumbnail Routes

app.use("/thumbnail",userThumbnailRouter);
app.use("/admin/thumbnail",adminThumbnailRouter);

//Product Variant Routes

app.use("/variant",userVariantRouter);
app.use("/seller/variant",sellerVariantRouter);

// Cart Routes

app.use("/cart",cartRouter);
app.use("/:admin/cart",adminCartRouter);

export default app;