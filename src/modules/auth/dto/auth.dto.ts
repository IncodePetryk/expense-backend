import { IsEmail, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;
}

export class LogInDto {
  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;
}

export class UpdateSessionDto {
  @IsString()
  readonly deviceName: string;
}

export class ChangePasswordDto {
  @IsString()
  readonly oldPassword: string;

  @IsString()
  readonly newPassword: string;
}
