import { Injectable } from '@nestjs/common'
import { AuthUsersRepository } from '../database/repositories/auth_user.repository'
import { AuthUser } from '../entities/auth_user.entity'

@Injectable()
export class AuthService {
    constructor(
        private authUserRepository: AuthUsersRepository,
        private authUser: AuthUser
    ) {}

    async create() {
        const user: AuthUser = this.authUserRepository.create({
            email: 'hi',
            username: 'hi',
            passwordHash: 'hi',
        })

        return await this.authUserRepository.save(user)
    }
}
