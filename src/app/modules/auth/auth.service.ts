/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcryptjs from 'bcryptjs';
import httpStatus from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { createUserTokens } from '../../utils/userTokens';
import { IUser } from '../user/user.interface';
import User from '../user/user.model';
import { createNewAccessTokenWithRefreshToken } from './../../utils/userTokens';
import { JwtPayload } from 'jsonwebtoken';
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

    // const jwtPayload = {
    //     userId: isUserExist._id,
    //     email: isUserExist.email,
    //     role: isUserExist.role
    // };
    // const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES_IN)
    // const refreshhToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRES_EXPIRES);

    const userTokens = createUserTokens(isUserExist);

    // delete isUserExist.password;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = isUserExist.toObject();

    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest
    };
};

const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);

    return {
        accessToken: newAccessToken
    };
};

const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    
    const user = await User.findById(decodedToken.userId)


    const isOldPasswordMatched = await bcryptjs.compare(oldPassword, user!.password as string)
    
    if (!isOldPasswordMatched) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Old password does not match");
    }

    user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUNDS))

    user!.save()
};

export const AuthServices = {
    credentialsLogin,
    getNewAccessToken,
    resetPassword
};
