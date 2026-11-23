// src/users/repositories/users.repository.ts
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from '../../database/repositories/base.repository'
import { User } from '../../entities/user.entity'

@Injectable()
export class UsersRepository extends BaseRepository<User> {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) {
        super(userRepo.target, userRepo.manager, userRepo.queryRunner)
    }
}
