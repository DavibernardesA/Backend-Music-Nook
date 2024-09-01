import { z } from 'zod';

export const userListSchema = z.object({
  userId: z.string().min(1, 'User id is required.').uuid('Invalid user id format.'),
  targetUserId: z.string().uuid('Invalid user id format.').optional()
});
