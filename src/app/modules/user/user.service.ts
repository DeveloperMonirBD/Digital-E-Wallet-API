import httpStatus from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { IAuthProvider, IUser } from './user.interface';
import User from './user.model';
import bcryptjs from 'bcryptjs';

// create user
const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User Already Exist');
    }
    // Hash the password if provided
    const hashedPassword = password ? await bcryptjs.hash(password as string, 10) : undefined;


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
