import {z} from 'zod';

export const emailSchema = z.object({
  email: z.email(),
  url: z.url(),
  name: z.string().trim().min(1, {message: "Please provide name"})
});