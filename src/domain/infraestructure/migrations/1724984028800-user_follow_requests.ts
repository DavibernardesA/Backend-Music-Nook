import { randomUUID } from 'crypto';
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class UserFollowRequests1724984028800 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_follow_requests',
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
            name: 'requester_id',
            type: 'uuid',
            isPrimary: true
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      'user_follow_requests',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE'
      })
    );

    await queryRunner.createForeignKey(
      'user_follow_requests',
      new TableForeignKey({
        columnNames: ['requester_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('user_follow_requests');

    if (table) {
      const foreignKey1 = table.foreignKeys.find(fk => fk.columnNames.includes('user_id'));
      const foreignKey2 = table.foreignKeys.find(fk => fk.columnNames.includes('requester_id'));

      if (foreignKey1) {
        await queryRunner.dropForeignKey('user_follow_requests', foreignKey1);
      }

      if (foreignKey2) {
        await queryRunner.dropForeignKey('user_follow_requests', foreignKey2);
      }

      await queryRunner.dropTable('user_follow_requests');
    }
  }
}
