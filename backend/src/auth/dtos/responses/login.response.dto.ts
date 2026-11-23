import { z } from 'zod';
import { AuthUserSchema } from '../entities/auth-user.dto';

const LoginResponseDtoSchema = z.object({
  statusCode: z.union([
    z.literal(201),
    z.literal(401),
    z.literal(501),
    z.literal(409),
  ]),
  message: z.string(),
  user: AuthUserSchema.nullable(),
  accessToken: z.string().nullable().optional(),
});
export type LoginResponseDto = z.infer<typeof LoginResponseDtoSchema>;
