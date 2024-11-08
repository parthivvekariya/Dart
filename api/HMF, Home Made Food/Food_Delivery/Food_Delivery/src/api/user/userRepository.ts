import { Transaction } from 'sequelize';

import { User } from '@/api/user/userModel';

export const userRepository = {
  findAllAsync: async (): Promise<User[] | null> => {
    return null;
  },

  findByEmailAsync: async (email: string): Promise<User | null> => {
    const user = await User.findOne({ where: { email } });
    return user;
  },

  findByIdAsync: async (userId: string): Promise<User | null> => {
    const user = await User.findByPk(userId);
    return user;
  },

  updateAsync: async (userId: string, payload: Record<string, any>, transaction: Transaction): Promise<string> => {
    await User.update(payload, { where: { userId }, transaction });
    return 'Successfully updated user';
  },
};
