import { Transaction } from 'sequelize';

import { User } from '@/api/user/userModel';

export const authRepository = {
  signupAsync: async (user: User, transaction: Transaction): Promise<User> => {
    const payload = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      passwordHash: user.passwordHash,
    };

    const newUser = await User.create(payload, { transaction });
    return newUser;
  },

  forgetPasswordAsync: async (email: string, transaction: Transaction): Promise<string> => {
    const user = await User.findOne({ where: { email }, transaction });
    if (!user) {
      throw new Error('User not found');
    }

    // TODO : Send email to user with password reset link
    return 'Password reset link sent to email';
  },

  updateLastLoginAsync: async (userId: string, transaction: Transaction): Promise<void> => {
    await User.update({ lastLogin: new Date() }, { where: { userId }, transaction });
  },
};
