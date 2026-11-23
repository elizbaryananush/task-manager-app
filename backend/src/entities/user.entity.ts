import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthUser } from './auth_user.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column('uuid')
  auth_id: string;

  @OneToOne(() => AuthUser, (authUser: AuthUser) => authUser.auth_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id' })
  authUser: AuthUser;

  @Column({ type: 'varchar' })
  firstname: string;

  @Column({ type: 'varchar', nullable: true })
  lastname?: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
