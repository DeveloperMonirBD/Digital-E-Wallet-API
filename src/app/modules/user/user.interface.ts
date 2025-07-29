import { Types } from 'mongoose';

export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
    GUIDE = 'GUIDE'
}

export enum isActive {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    BLOCKED = 'BLOCKED',
    DELETED = 'DELETED',
    VERIFIED = 'VERIFIED'
}

export interface IAuthProvider {
    provider: 'google' | 'credentials';
    providerId: string;
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: number;
    scope?: string;
    tokenType?: string;
    idToken?: string;
    email?: string;
    emailVerified?: boolean;
    phoneNumber?: string;
}

export interface IUser {
    _id?: Types.ObjectId;
    name: string;
    age: number;
    email: string;
    password?: string;
    phone?: string;
    picture?: string;
    address?: string;
    isDeleted?: boolean;
    isActive?: isActive;
    isVerified?: boolean;
    auths: IAuthProvider[];
    role: Role;
    wallet?: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
