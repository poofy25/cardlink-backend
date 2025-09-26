import { MigrationInterface, QueryRunner } from "typeorm";

export class NAME1758826359254 implements MigrationInterface {
    name = 'NAME1758826359254'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" ADD "isIncomplete" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "links" ALTER COLUMN "title" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" ALTER COLUMN "title" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "isIncomplete"`);
    }

}
