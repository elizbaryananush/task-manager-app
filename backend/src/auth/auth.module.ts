import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthUser } from '../entities/auth_user.entity'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AuthUsersRepository } from '../database/repositories/auth_user.repository'

@Module({
    imports: [TypeOrmModule.forFeature([AuthUser])],
    controllers: [AuthController],
    providers: [AuthService, AuthUsersRepository, AuthUser],
    exports: [AuthService, AuthUsersRepository],
})
export class AuthModule {}
