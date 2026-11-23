// src/database/repositories/base.repository.ts
import { NotFoundException } from '@nestjs/common'
import {
    DeepPartial,
    FindOptionsWhere,
    ObjectLiteral,
    Repository,
} from 'typeorm'

export abstract class BaseRepository<
    T extends ObjectLiteral,
> extends Repository<T> {
    async findById(id: string): Promise<T | null> {
        return this.findOne({
            where: { id } as unknown as FindOptionsWhere<T>,
        })
    }

    async findByIdOrFail(id: string, entityName = 'Resource'): Promise<T> {
        const entity = await this.findById(id)
        if (!entity) {
            throw new NotFoundException(
                `${entityName} with ID "${id}" not found`
            )
        }
        return entity
    }

    async createAndSave(data: DeepPartial<T>): Promise<T> {
        const entity = this.create(data)
        return this.save(entity)
    }

    async existsBy(where: FindOptionsWhere<T>): Promise<boolean> {
        const count = await this.count({ where })
        return count > 0
    }
}
