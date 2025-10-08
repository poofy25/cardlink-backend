import { MigrationInterface, QueryRunner } from "typeorm";

export class NAME1758954172562 implements MigrationInterface {
    name = 'NAME1758954172562'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" ALTER COLUMN "isActive" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" ALTER COLUMN "isActive" SET DEFAULT true`);
    }

}
