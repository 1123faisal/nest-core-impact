import * as bcrypt from 'bcrypt';

export const Password = {
  hashPassword: async (password: string) => {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  },
  comparePassword: async (password: string, hashPassword: string) => {
    return await bcrypt.compare(password, hashPassword);
  },
};
