import httpStatus from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { IAuthProvider, IUser } from './user.interface';
import User from './user.model';

// create user
const createUser = async (payload: Partial<IUser>) => {
    const { email, ...rest } = payload;

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User Already Exist');
    }

    const authProvider: IAuthProvider = {
        provider: 'credentials',
        providerId: email as string
    };
    
    const user = await User.create({
        email,
        auths: [authProvider],
        ...rest
    });

    return user;
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
    getAllUsers
};
