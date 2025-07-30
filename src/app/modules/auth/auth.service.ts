import bcryptjs from 'bcryptjs';
import httpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import AppError from '../../errorHelpers/AppError';
import { IUser } from '../user/user.interface';
import User from '../user/user.model';
import { generateToken } from '../../utils/jwt';
import { envVars } from '../../config/env';

const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload;

    const isUserExist = await User.findOne({ email });
    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User does not exist');
    }

    // Check if password is provided and hashed
    const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string);

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Password does not match');
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    };

    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES_IN )

    return {
        accessToken
    };
};

export const AuthServices = {
    credentialsLogin
};
