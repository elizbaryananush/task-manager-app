import { z } from 'zod';

export const CheckUsernameSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/),
});
export type CheckUsernameDto = z.infer<typeof CheckUsernameSchema>;
