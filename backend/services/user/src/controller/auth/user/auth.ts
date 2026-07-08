import UserModel, { type IUser } from "../../../model/user.js";
import type { Request, Response } from "express";
import redis from "../../../util/redis.js";
import argon2 from 'argon2';
import { sendEmail } from "../../../helper/sendEmail.js";
<<<<<<< HEAD
=======
import { emailQueue } from "../../../queue/email.queue.js";
import { createToken } from "../../../helper/mangeToken.js";
import mongoose from "mongoose";

export const regiseter = async (req: Request, res: Response) => {
    const { fullName, email, phone, password } = req.body as IUser;

    if (!fullName || !email || !phone || !password) {
        return res.status(400).json({ message: "Please fill all the fields", success: false });
    }

    const normalizedEmail = email.toLowerCase().trim();


    const user: IUser | null = await UserModel.findOne({ email: normalizedEmail }).lean();

    if (user) {
        return res.status(400).json({
            message: "User already register",
            success: false
        })
    }

    const newUser = new UserModel({
        fullName,
        email: normalizedEmail,
        password: await argon2.hash(password),
        phone
    });

    await newUser.save();

    const token = createToken(newUser);

    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    }).status(201).json({
        message: "User create successfully",
        success: true,
        data: newUser
    });
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Fill the both fields",
            success: false
        })
    }

    const normalizeEmail = email.toLowerCase().trim();

    const user = await UserModel.findOne({ email: normalizeEmail })
        .select("+password");
    if (!user) {
        return res.status(404).json({
            message: "User not found",
            success: false
        })
    }

    const isMatch = await argon2.verify(user.password, password);

    if (!isMatch) {
        return res.status(401).json({
            message: "Wrong password",
            success: false,
        })
    }

    const token = createToken(user);
<<<<<<< HEAD

=======
    
>>>>>>> 3e956ce (Initial commit)
    user.lastLoginAt = new Date();
    await user.save();

    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    }).status(200).json({
        success: true,
        message: "user login successfully",
        data: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            phone: user.phone,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    })
}

export const logoutUser = (_req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });

    return res.status(200).json({
        success: true,
        message: "Logout successful"
    });
};

export const sendEmailVerifictionCode = async (req: Request, res: Response) => {
    const { userId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid user id"
        });
    }

    const user = await UserModel.findOne({
        _id: new mongoose.Types.ObjectId(userId),
        isVerified: false
    });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found or already verified"
        });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await redis.set(
        `verify_email:${userId}`,
        code,
        "EX",
        5 * 60
    );
<<<<<<< HEAD

=======
    
>>>>>>> 3e956ce (Initial commit)
    await sendEmail({
        to: user.email,
        subject: "Email Verification Code",
        html: `<p>Your verification code is <b>${code}</b></p>`
    })


    return res.status(200).json({
        success: true,
        message: "Verification code sent successfully"
    });
};

export const verifyEmail = async (req: Request, res: Response) => {
    const { code } = req.body;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid user id"
        });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    if (user.isVerified) {
        return res.status(400).json({
            success: false,
            message: "Email already verified"
        });
    }

    const redisKey = `verify_email:${userId}`;
    const savedCode = await redis.get(redisKey);

    if (!savedCode) {
        return res.status(400).json({
            success: false,
            message: "Verification code expired or not found"
        });
    }

    if (savedCode !== code) {
        return res.status(401).json({
            success: false,
            message: "Wrong verification code"
        });
    }

    user.isVerified = true;
    await user.save();

    await redis.del(redisKey);

    const token = createToken(user);

    return res
        .cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        .status(200)
        .json({
            success: true,
            message: "Email verified successfully"
        });
};

export const sendResetPasswordCode = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Please provide email"
        });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
        return res.status(200).json({
            success: true,
            message: "If the email exists, a reset code has been sent"
        });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await redis.set(
        `reset_password:${user._id}`,
        code,
        "EX",
        5 * 60
    );

    await sendEmail({
        to: email,
        subject: "Reset Password Code",
        html: `<p>Your reset password code is <b>${code}</b>. It expires in 5 minutes.</p>`
    })

    return res.status(200).json({
        success: true,
        message: "If the email exists, a reset code has been sent"
    });
};

export const resetPassword = async (req: Request, res: Response) => {
    const { email, newPassword, confirmPassword, code } = req.body;

    if (!newPassword || !confirmPassword || newPassword !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Passwords do not match"
        });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Invalid request"
        });
    }

    const redisKey = `reset_password:${user._id}`;
    const savedCode = await redis.get(redisKey);

    if (!savedCode) {
        return res.status(400).json({
            success: false,
            message: "Reset code expired or invalid"
        });
    }

    if (savedCode !== code) {
        return res.status(400).json({
            success: false,
            message: "Wrong reset code"
        });
    }

    user.password = await argon2.hash(newPassword);
    await user.save();

    await redis.del(redisKey);

    return res.status(200).json({
        success: true,
        message: "Password reset successfully"
    });
};

export const changePassword = async (req: Request, res: Response) => {
    const { password, newPassword, confirmPassword } = req.body;

    const { userId } = req.user;

    if (!password || !newPassword || !confirmPassword) {
        return res.status(400).json({
            message: "Plaese fill all the fields",
            success: false
        })
    }

    const user = await UserModel.findById(userId).select("+password");

    if (!user) {
        return res.status(404).json({
            message: "User not found",
            success: false
        })
    }

    const isMatch = await argon2.verify(user.password, password);

    if (!isMatch) {
        return res.status(401).json({
            message: "Wrong password",
            success: false
        })
    }

    user.password = await argon2.hash(newPassword);

    await user.save();

    res.status(200).json({
        message: "Password change successfully",
        success: true,
    })
}