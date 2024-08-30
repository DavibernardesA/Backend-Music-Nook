import { randomUUID } from 'crypto';
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class UserFollowers1724984017547 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_followers',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: `'${randomUUID()}'`
          },
          {
            name: 'user_id',
            type: 'uuid',
            isPrimary: true
          },
          {
            name: 'follower_id',
            type: 'uuid',
            isPrimary: true
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      'user_followers',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE'
      })
    );

    await queryRunner.createForeignKey(
      'user_followers',
      new TableForeignKey({
        columnNames: ['follower_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('user_followers');

    if (table) {
      const foreignKey1 = table.foreignKeys.find(fk => fk.columnNames.includes('user_id'));
      const foreignKey2 = table.foreignKeys.find(fk => fk.columnNames.includes('follower_id'));

      if (foreignKey1) {
        await queryRunner.dropForeignKey('user_followers', foreignKey1);
      }

      if (foreignKey2) {
        await queryRunner.dropForeignKey('user_followers', foreignKey2);
      }

      await queryRunner.dropTable('user_followers');
    }
  }
}
