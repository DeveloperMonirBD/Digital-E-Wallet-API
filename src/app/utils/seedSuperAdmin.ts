import bcryptjs from 'bcryptjs';
import { envVars } from '../config/env';
import { IAuthProvider, IUser, Role } from '../modules/user/user.interface';
import User from '../modules/user/user.model';

export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExists = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL });

        if (isSuperAdminExists) {
            console.log('Super Admin already exists');
            return;
        }

        console.log('Trying to create SuperAdmin.....');

        const hashedPassword = await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD, parseInt(envVars.BCRYPT_SALT_ROUNDS));

        const authProvider: IAuthProvider = {
            provider: 'credentials',
            providerId: envVars.SUPER_ADMIN_EMAIL
        };

        const payload: IUser = {
            name: 'Super Admin',
            email: envVars.SUPER_ADMIN_EMAIL,
            role: Role.SUPER_ADMIN,
            password: hashedPassword,
            isVerified: true,
            auths: [authProvider]
        };

        const superAdmin = await User.create(payload);

        console.log('Super admin Created Successfully! \n');
        console.log(superAdmin);
    } catch (error) {
        console.log(error);
    }
};
