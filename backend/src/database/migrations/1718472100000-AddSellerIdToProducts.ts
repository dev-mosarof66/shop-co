import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class AddSellerIdToProducts1718472100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'sellerId',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'products',
      new TableForeignKey({
        columnNames: ['sellerId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('products');
    const fk = table?.foreignKeys.find(f => f.columnNames.includes('sellerId'));
    if (fk) await queryRunner.dropForeignKey('products', fk);
    await queryRunner.dropColumn('products', 'sellerId');
  }
}
