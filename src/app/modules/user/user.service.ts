import bcryptjs from 'bcryptjs';
import httpStatus from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { envVars } from '../../config/env';
import AppError from '../../errorHelpers/AppError';
import { IAuthProvider, IUser, Role } from './user.interface';
import User from './user.model';

// create user
const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User Already Exist');
    }
    // Hash the password if provided
    const hashedPassword = password ? await bcryptjs.hash(password as string, parseInt(envVars.BCRYPT_SALT_ROUNDS)) : undefined;

    // Check if password is provided and hashed
    // const isPasswordMatched = await bcryptjs.compare(password as string, hashedPassword as string)

    const authProvider: IAuthProvider = {
        provider: 'credentials',
        providerId: email as string
    };

    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    });

    return user;
};

// update user
const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
    const ifUserExists = await User.findById(userId);

    if (!ifUserExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }
    // if (ifUserExists.isDeleted || ifUserExists.isActive === IsActive.BLOCKED) {
    //     throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to update this user');
    // }
    if (payload.role) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
            throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to update this user');
        }
        if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
            throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to update this user role');
        }
    }
    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
            throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to update this user role');
        }
    }
    if (payload.password) {
        payload.password = await bcryptjs.hash(payload.password, parseInt(envVars.BCRYPT_SALT_ROUNDS));
    }
    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });
    return newUpdatedUser;
};

// get all users
const getAllUsers = async () => {
    const users = await User.find({});

    const totalUsers = await User.countDocuments();

    return {
        data: users,
        meta: {
            total: totalUsers
        }
    };
};

export const UserServices = {
    createUser,
    getAllUsers,
    updateUser
};
