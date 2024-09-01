import bcrypt from 'bcrypt';

export class BcryptService {
  async encrypt(t: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(t, 10);

    return hashedPassword;
  }

  async compare(t: string, hashedT: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(t, hashedT);

    return isMatch;
  }
}
