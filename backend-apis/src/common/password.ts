import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

export const Password = {
  hashPassword: async (password: string) => {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  },
  comparePassword: async (password: string, hashPassword: string) => {
    return await bcrypt.compare(password, hashPassword);
  },

  generateRandomPassword(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const password = Array.from(crypto.randomFillSync(new Uint8Array(length)))
      .map((byte) => characters[byte % characters.length])
      .join('');
    return password;
  },
};
