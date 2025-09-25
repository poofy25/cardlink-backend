import { MigrationInterface, QueryRunner } from "typeorm";

export class NAME1758729786206 implements MigrationInterface {
    name = 'NAME1758729786206'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // First, add the new type column as nullable
        await queryRunner.query(`ALTER TABLE "links" ADD "type" character varying(64)`);
        
        // Update existing rows to have a default type value
        await queryRunner.query(`UPDATE "links" SET "type" = 'custom' WHERE "type" IS NULL`);
        
        // Now make the type column NOT NULL
        await queryRunner.query(`ALTER TABLE "links" ALTER COLUMN "type" SET NOT NULL`);
        
        // Drop the old kind column
        await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "kind"`);
        
        // Make url column nullable
        await queryRunner.query(`ALTER TABLE "links" ALTER COLUMN "url" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" ALTER COLUMN "url" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "links" ADD "kind" character varying(32) NOT NULL DEFAULT 'custom'`);
    }

}
