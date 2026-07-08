import { Worker } from "bullmq";
import { sendEmail } from "../helper/sendEmail.js";

export const emailWorker = new Worker(
  "email-queue",
  async (job) => {
    const { to, subject, html } = job.data;

    await sendEmail({
      to,
      subject,
      html
    });
  },
  {
    connection: {
        host: "127.0.0.1",
        port: 6379,
        maxRetriesPerRequest: null
    },
    concurrency: 5
  }
);

emailWorker.on("completed", (job) => {
  console.log(`✅ Email job ${job.id} completed`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`❌ Email job ${job?.id} failed`, err);
});