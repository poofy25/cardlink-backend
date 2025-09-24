import { MigrationInterface, QueryRunner } from "typeorm";

export class NAME1758728148440 implements MigrationInterface {
    name = 'NAME1758728148440'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cardlinks" ADD "jobTitle" character varying(60)`);
        await queryRunner.query(`ALTER TABLE "cardlinks" ADD "company" character varying(60)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cardlinks" DROP COLUMN "company"`);
        await queryRunner.query(`ALTER TABLE "cardlinks" DROP COLUMN "jobTitle"`);
    }

}
