import app from "./app.js";
import http from 'http';
import mongoose from "mongoose";
import { config } from "dotenv";
import { connectDatabase } from "./config/db.js";


config();

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  await connectDatabase();

  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

  const shutdown = async (signal: string) => {
    console.log(`🛑 ${signal} received. Shutting down...`);
    await mongoose.connection.close();
    server.close(() => process.exit(0));
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

startServer();
