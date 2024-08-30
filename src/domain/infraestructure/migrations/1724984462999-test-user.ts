import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class User1724984000133 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'users',
      columns: [
        {
          name: 'id',
          type: 'text',
          isPrimary: true,
          default: 'random()'
        },
        {
          name: 'username',
          type: 'varchar',
          isUnique: true,
          length: '50'
        },
        {
          name: 'email',
          type: 'varchar',
          isUnique: true,
          length: '100'
        },
        {
          name: 'password',
          type: 'varchar',
          length: '255'
        },
        {
          name: 'avatar',
          type: 'varchar',
          isNullable: true
        },
        {
          name: 'bio',
          type: 'text',
          isNullable: true
        },
        {
          name: 'followers_count',
          type: 'integer',
          default: 0
        },
        {
          name: 'following_count',
          type: 'integer',
          default: 0
        },
        {
          name: 'social_links',
          type: 'text',
          isNullable: true
        },
        {
          name: 'music_interests',
          type: 'text',
          isNullable: true
        },
        {
          name: 'is_private',
          type: 'boolean',
          default: false
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'CURRENT_TIMESTAMP'
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          default: 'CURRENT_TIMESTAMP',
          onUpdate: 'CURRENT_TIMESTAMP'
        }
      ]
    });

    await queryRunner.createTable(table);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
