import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const RegisterZ = extendApi(
  z.object({
    username: z.string(),
    email: z.string(),
    password: z.string(),
  }),
  {
    title: 'Register user',
  },
);

export class RegisterDto extends createZodDto(RegisterZ) {}

export const LogInZ = extendApi(
  z.object({
    email: z.string(),
    password: z.string(),
  }),
  {
    title: 'Log-in user',
  },
);

export class LogInDto extends createZodDto(LogInZ) {}

export const UpdateSessionZ = extendApi(
  z.object({
    deviceName: z.string(),
  }),
  {
    title: 'Update session',
    description: 'Update session device name',
  },
);

export class UpdateSessionDto extends createZodDto(UpdateSessionZ) {}

export const ChangePasswordZ = extendApi(
  z.object({
    oldPassword: z.string(),
    newPassword: z.string(),
  }),
  {
    title: 'Change password',
  },
);

export class ChangePasswordDto extends createZodDto(ChangePasswordZ) {}
