import { z } from 'zod';

export const AuthUserSchema = z.object({
  auth_id: z.string(), // change to z.number() if your ID column is numeric
  username: z.string(),
  email: z.string().email(),
});

export type AuthUserDto = z.infer<typeof AuthUserSchema>;
