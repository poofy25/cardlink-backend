import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveWebsiteType1758954172562 implements MigrationInterface {
    name = 'RemoveWebsiteType1758954172562'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Change all links with type "website" to "custom-link"
        await queryRunner.query(`UPDATE "links" SET "type" = 'custom-link' WHERE "type" = 'website'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert "custom-link" back to "website" (if needed)
        await queryRunner.query(`UPDATE "links" SET "type" = 'website' WHERE "type" = 'custom-link'`);
    }

}
