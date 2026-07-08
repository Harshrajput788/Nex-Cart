import JWT from 'jsonwebtoken';
import type { IUser } from '../model/user.js';

export const createToken = (user:IUser) =>{
    const payload = {
        userId:user._id,
        role:user.role,
        isVerifiedStatus:user.isVerified
    }

    const token = JWT.sign(payload,process.env.ACCESSTOKENSERCRET as string,{expiresIn:"7d"});

    return token;
}