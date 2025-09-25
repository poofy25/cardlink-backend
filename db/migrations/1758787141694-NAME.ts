import { MigrationInterface, QueryRunner } from "typeorm";

export class NAME1758787141694 implements MigrationInterface {
    name = 'NAME1758787141694'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_580013e316860eaa65a450cf4f7"`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "FK_580013e316860eaa65a450cf4f7" FOREIGN KEY ("activeCardLinkId") REFERENCES "cardlinks"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_580013e316860eaa65a450cf4f7"`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "FK_580013e316860eaa65a450cf4f7" FOREIGN KEY ("activeCardLinkId") REFERENCES "cardlinks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
