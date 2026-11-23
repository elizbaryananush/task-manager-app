import {
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from './user.entity'

@Entity('auth_users')
export class AuthUser {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', unique: true })
    email: string

    @Column({ type: 'varchar', unique: true })
    username: string

    @Column({ type: 'varchar' })
    passwordHash: string

    @Column({ type: 'varchar', nullable: true })
    refreshToken?: string | null

    @OneToOne(() => User, (user: User) => user.id, { cascade: true })
    user: User

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date
}
