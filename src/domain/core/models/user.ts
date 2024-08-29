import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  avatar?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'int', default: 0 })
  followers_count: number;

  @Column({ type: 'int', default: 0 })
  following_count: number;

  @Column({ type: 'json', nullable: true })
  social_links?: { twitter?: string; instagram?: string; spotify?: string };

  @Column({ type: 'json', nullable: true })
  music_interests?: { genres: string[]; artists: string[]; albums: string[] };

  @Column({ type: 'boolean', default: false })
  is_private: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Usuários que estão seguindo este usuário
  @ManyToMany(() => User, user => user.following)
  @JoinTable({
    name: 'user_followers',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'follower_id' }
  })
  followers: User[];

  @ManyToMany(() => User, user => user.followers)
  following: User[];

  @ManyToMany(() => User, user => user.sentFollowRequests)
  @JoinTable({
    name: 'user_follow_requests',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'requester_id' }
  })
  followRequests: User[];

  @ManyToMany(() => User, user => user.followRequests)
  sentFollowRequests: User[];
}
