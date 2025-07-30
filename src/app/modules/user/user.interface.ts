import { Types } from 'mongoose';

export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER',
    AGENT = 'AGENT'
}

export enum IsActive {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    SUSPENDED = 'SUSPENDED',
    BLOCKED = 'BLOCKED',
    DELETED = 'DELETED',
    VERIFIED = 'VERIFIED'
}

export type AuthProviderType = 'google' | 'credentials';

export interface IAuthProvider {
    provider: AuthProviderType;
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
    age?: number;
    email: string;
    password?: string;
    role: Role;
    phone?: string;
    picture?: string;
    address?: string;

    isDeleted?: boolean;
    isActive?: IsActive;
    isVerified?: boolean;

    auths: IAuthProvider[];
    wallet?: Types.ObjectId;
    commissionRate?: number; // relevant to agents

    createdAt?: Date;
    updatedAt?: Date;
}
