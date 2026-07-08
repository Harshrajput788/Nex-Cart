import express from 'express';
import proxy from 'express-http-proxy'
import type { Request } from 'express';
import cors from "cors"
import { config } from 'dotenv';

config();

const app = express();

const PORT = process.env.PORT || 3000;

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3003';

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

app.use(
  "/api/v1/user",
  proxy(USER_SERVICE_URL, {
    proxyReqPathResolver: (req: Request) => {
      return req.url;
    },
    userResHeaderDecorator(headers, userReq, userRes, proxyReq, proxyRes) {
      if (proxyRes.headers["token"]) {
        headers["token"] = proxyRes.headers["token"];
      }
      return headers;
    },
  })
);
app.use('/api/v1/product', proxy(PRODUCT_SERVICE_URL));
app.use('/api/v1/order', proxy(ORDER_SERVICE_URL));

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
