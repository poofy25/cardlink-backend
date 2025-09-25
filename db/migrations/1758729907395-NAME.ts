import { MigrationInterface, QueryRunner } from "typeorm";

export class NAME1758729907395 implements MigrationInterface {
    name = 'NAME1758729907395'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "iconKey"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" ADD "iconKey" character varying(64)`);
    }

}
