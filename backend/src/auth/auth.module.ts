import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthUser } from '../entities/auth_user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthUsersRepository } from '../database/repositories/auth_user.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthUser]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'your-super-secret-key',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthUsersRepository, AuthUser],
  exports: [AuthService, AuthUsersRepository],
})
export class AuthModule {}
