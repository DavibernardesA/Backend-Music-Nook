import { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transformData = (schema: z.ZodObject<any>, body: any) => {
  if (body.social_links && typeof body.social_links === 'string') {
    body.social_links = JSON.parse(body.social_links);
  }
  if (body.music_interests && typeof body.music_interests === 'string') {
    body.music_interests = JSON.parse(body.music_interests);
  }
  if (typeof body.is_private === 'string') {
    body.is_private = body.is_private === 'true';
  }
  return schema.parse(body);
};
