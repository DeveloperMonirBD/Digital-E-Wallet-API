import { Schema, model } from 'mongoose';
import { IUser, Role, isActive } from './user.interface';

const authProviderSchema = new Schema(
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
    { _id: false }
);

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        age: { type: Number },
        email: { type: String, required: true, unique: true },
        password: { type: String }, // optional for OAuth users
        phone: { type: String },
        picture: { type: String },
        address: { type: String },

        isDeleted: { type: Boolean, default: false },
        isActive: {
            type: String,
            enum: Object.values(isActive),
            default: isActive.ACTIVE
        },
        isVerified: { type: Boolean, default: false },

        auths: {
            type: [authProviderSchema],
            default: [{ provider: 'credentials', providerId: 'local' }]
        },

        role: {
            type: String,
            enum: Object.values(Role),
            default: Role.USER
        },

        wallet: {
            type: Schema.Types.ObjectId,
            ref: 'Wallet',
            default: null
        }
    },
    {
        timestamps: true
    }
);

const UserModel = model<IUser>('User', userSchema);
export default UserModel;
