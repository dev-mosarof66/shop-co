import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixSellerIdFk1718472200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('products');
    const fk = table?.foreignKeys.find(f => f.columnNames.includes('sellerId'));
    if (fk) {
      await queryRunner.dropForeignKey('products', fk);
    }
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // Intentionally left as no-op — the old FK referenced the wrong table
  }
}
