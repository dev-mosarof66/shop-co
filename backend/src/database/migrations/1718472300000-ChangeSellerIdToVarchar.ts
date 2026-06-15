import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeSellerIdToVarchar1718472300000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "sellerId" TYPE varchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ALTER COLUMN "sellerId" TYPE uuid USING "sellerId"::uuid`,
    );
  }
}
