import { z } from 'zod';

export const resetPasswordSchema = z.object({
  encryptedIp: z.string().min(1, 'Encrypted IP is required.'),
  resetToken: z.string().min(1, 'Reset token is required.'),
  encryptedToken: z.string().min(1, 'Invalid request: Cookies required for password reset were not found. Please enable cookies and try again.'),
  newPassword: z.string().min(1, 'New password is required.'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  emailRequestReset: z.string().min(1, 'Invalid request: Cookies required for password reset were not found. Please enable cookies and try again.')
});
