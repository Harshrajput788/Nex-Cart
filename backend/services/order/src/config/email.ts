import { config } from "dotenv";
import nodemailer from "nodemailer";

config();

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify((error:any) => {
  if (error) {
    console.error("❌ Email service error:", error);
  } else {
    console.log("✅ Email service ready");
  }
});

