import { z } from 'zod';
import { AuthUserSchema } from '../entities/auth-user.dto';

const RegisterResponseDtoSchema = z.object({
  statusCode: z.union([z.literal(201), z.literal(409)]),
  message: z.string(),
  user: AuthUserSchema.nullable(),
  accessToken: z.string().nullable().optional(),
});
export type RegisterResponseDto = z.infer<typeof RegisterResponseDtoSchema>;
