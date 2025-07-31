import { verifyToken as verifyJwtToken } from './../../utils/jwt';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { UserServices } from './user.service';
import { envVars } from '../../config/env';
import { JwtPayload } from 'jsonwebtoken';

//create user with catchAsync
const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'User created Successfully',
        data: user
    });
});

// update user with catchAsync
const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    // const token = req.headers.authorization;
    // const verifyToken = verifyJwtToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload;

    // Assuming req.user is set by the checkAuth middleware
    const verifyToken = req.user;

    const payload = req.body;
    const user = await UserServices.updateUser(userId, payload, verifyToken);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'User Updated Successfully',
        data: user
    });
});

// get all users
const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'All Users Retrieved Successfully',
        data: result.data,
        meta: result.meta
    });
});

export const UserControllers = {
    createUser,
    getAllUsers,
    updateUser
};
