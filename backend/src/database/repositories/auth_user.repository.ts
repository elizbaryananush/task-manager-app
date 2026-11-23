import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from '../../database/repositories/base.repository'
import { AuthUser } from '../../entities/auth_user.entity'

@Injectable()
export class AuthUsersRepository extends BaseRepository<AuthUser> {
    constructor(
        @InjectRepository(AuthUser)
        private readonly authUserRepo: Repository<AuthUser>
    ) {
        super(
            authUserRepo.target,
            authUserRepo.manager,
            authUserRepo.queryRunner
        )
    }
}
