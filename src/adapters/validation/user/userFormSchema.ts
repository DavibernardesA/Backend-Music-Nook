import { z } from 'zod';

export const userCreateSchema = z.object({
  username: z.string().min(1, 'Name is required').max(100, 'Name must be at least 100 characters long'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  bio: z.string().optional(),
  social_links: z
    .object({
      twitter: z.string().url('Invalid URL format').optional(),
      instagram: z.string().url('Invalid URL format').optional(),
      spotify: z.string().url('Invalid URL format').optional()
    })
    .optional(),
  music_interests: z
    .object({
      genres: z.array(z.string()).optional(),
      artists: z.array(z.string()).optional(),
      albums: z.array(z.string()).optional()
    })
    .optional(),
  is_private: z.boolean().optional()
});

export const userUpdateSchema = userCreateSchema.partial();
