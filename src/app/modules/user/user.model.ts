import { model, Schema } from 'mongoose';
import { IAuthProvider, IsActive, IUser, Role } from './user.interface';

const AuthProviderSchema = new Schema<IAuthProvider>(
    {
        provider: {
            type: String,
            enum: ['google', 'credentials'],
            required: true
        },
        providerId: { type: String, required: true },
        accessToken: String,
        refreshToken: String,
        expiresIn: Number,
        scope: String,
        tokenType: String,
        idToken: String,
        email: String,
        emailVerified: Boolean,
        phoneNumber: String
    },
    {
        versionKey: false,
        _id: false,
        timestamps: false
    }
);

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        age: Number,
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String }, // optional for OAuth users
        role: {
            type: String,
            enum: Object.values(Role),
            default: Role.USER
            // required: true,
        },
        phone: { type: String, unique: true, sparse: true },
        picture: { type: String },
        address: { type: String },

        isDeleted: { type: Boolean, default: false },
        isActive: {
            type: String,
            enum: Object.values(IsActive),
            default: IsActive.ACTIVE
        },
        isVerified: { type: Boolean, default: false },
        auths: {
            type: [AuthProviderSchema],
            default: [{ provider: 'credentials', providerId: 'local' }]
        },
        wallet: {
            type: Schema.Types.ObjectId,
            ref: 'Wallet',
            default: null
        },
        commissionRate: {
            type: Number
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const User = model<IUser>('User', userSchema);
export default User;
