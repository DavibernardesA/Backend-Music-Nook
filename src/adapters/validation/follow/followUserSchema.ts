import { z } from 'zod';

export const followUserSchema = z.object({
  userId: z.string().min(1, 'User id is required.').uuid('Invalid user id format.'),
  targetUserId: z.string().min(1, 'Target user id is required.').uuid('Invalid target user id format.')
});

export const findUserSchema = followUserSchema.partial();
