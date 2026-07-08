import type { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from "crypto"
import OrderModel from "../../model/order.js"
import type { PaymentStatus, PaymentMethod } from '../../model/order.js'


export const createPayment = async (req: Request, res: Response) => {
  const { amount, recipient } = req.body;

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_KEY_SECRET as string,
  });

  if (!recipient || !amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Valid recipient and amount are required",
    });
  }

  const options = {
    amount: Math.round(amount * 100),
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
    notes: {
      recipient,
    },
  };

  const order = await razorpay.orders.create(options);

  return res.status(201).json({
    success: true,
    message: "Payment order created successfully",
    data: {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    },
  });
};

export const validatePayment = async (req: Request, res: Response) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    transactionId
  } = req.body;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature
  ) {
    return res.status(400).json({
      success: false,
      message: "Incomplete payment verification data",
    });
  }

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: "Invalid payment signature",
    });
  }

  const order = await OrderModel.findOne({
    "payment.transactionId": transactionId,
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found for this payment",
    });
  }

  if (order.payment?.status === "PAID") {
    return res.status(200).json({
      success: true,
      message: "Payment already verified",
    });
  }

  order.payment = {
    method: "RazorPay" as PaymentMethod,
    status: "PAID" as PaymentStatus,
    transactionId: razorpay_order_id,
  };

  await order.save();

  return res.status(200).json({
    success: true,
    message: "Payment verified and order updated successfully",
  });
};