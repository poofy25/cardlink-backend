import { MigrationInterface, QueryRunner } from "typeorm";

export class NAME1758543900754 implements MigrationInterface {
    name = 'NAME1758543900754'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link_clicks" DROP CONSTRAINT "FK_206c3d2fb8e1933259ca97ba7a2"`);
        await queryRunner.query(`ALTER TABLE "links" DROP CONSTRAINT "FK_847fa4b231e7f78e5a6d448c66f"`);
        await queryRunner.query(`ALTER TABLE "media_assets" DROP CONSTRAINT "FK_b1a7db245fb47e3bc68af341741"`);
        await queryRunner.query(`ALTER TABLE "link_clicks" RENAME COLUMN "profileId" TO "cardLinkId"`);
        await queryRunner.query(`ALTER TABLE "links" RENAME COLUMN "profileId" TO "cardLinkId"`);
        await queryRunner.query(`ALTER TABLE "media_assets" RENAME COLUMN "profileId" TO "cardLinkId"`);
        await queryRunner.query(`CREATE TABLE "accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(320) NOT NULL, "passwordHash" character varying(255) NOT NULL, "displayName" character varying(120) NOT NULL, "onboardingState" character varying(32) NOT NULL DEFAULT 'none', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ee66de6cdc53993296d1ceb8aa" ON "accounts" ("email") `);
        await queryRunner.query(`CREATE TABLE "cardlinks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying(64) NOT NULL, "name" character varying(120) NOT NULL, "bio" character varying(280), "avatarUrl" character varying(512), "theme" jsonb, "isPublic" boolean NOT NULL DEFAULT true, "layoutMode" character varying(32) NOT NULL DEFAULT 'full_row_buttons', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ownerId" uuid, CONSTRAINT "PK_896e83be355ce17828dc5f9c0fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_2f00cb244bcd288237738eec53" ON "cardlinks" ("slug") `);
        await queryRunner.query(`ALTER TABLE "link_clicks" ADD CONSTRAINT "FK_8bbd0b1cbf90b3c58365b82117d" FOREIGN KEY ("cardLinkId") REFERENCES "cardlinks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "links" ADD CONSTRAINT "FK_dfb574f67c6003d0d02542f0e3c" FOREIGN KEY ("cardLinkId") REFERENCES "cardlinks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cardlinks" ADD CONSTRAINT "FK_e794fda2cf6c70b5918849219e6" FOREIGN KEY ("ownerId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "media_assets" ADD CONSTRAINT "FK_97855fa1b3556a76c8f06a583af" FOREIGN KEY ("cardLinkId") REFERENCES "cardlinks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media_assets" DROP CONSTRAINT "FK_97855fa1b3556a76c8f06a583af"`);
        await queryRunner.query(`ALTER TABLE "cardlinks" DROP CONSTRAINT "FK_e794fda2cf6c70b5918849219e6"`);
        await queryRunner.query(`ALTER TABLE "links" DROP CONSTRAINT "FK_dfb574f67c6003d0d02542f0e3c"`);
        await queryRunner.query(`ALTER TABLE "link_clicks" DROP CONSTRAINT "FK_8bbd0b1cbf90b3c58365b82117d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2f00cb244bcd288237738eec53"`);
        await queryRunner.query(`DROP TABLE "cardlinks"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ee66de6cdc53993296d1ceb8aa"`);
        await queryRunner.query(`DROP TABLE "accounts"`);
        await queryRunner.query(`ALTER TABLE "media_assets" RENAME COLUMN "cardLinkId" TO "profileId"`);
        await queryRunner.query(`ALTER TABLE "links" RENAME COLUMN "cardLinkId" TO "profileId"`);
        await queryRunner.query(`ALTER TABLE "link_clicks" RENAME COLUMN "cardLinkId" TO "profileId"`);
        await queryRunner.query(`ALTER TABLE "media_assets" ADD CONSTRAINT "FK_b1a7db245fb47e3bc68af341741" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "links" ADD CONSTRAINT "FK_847fa4b231e7f78e5a6d448c66f" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "link_clicks" ADD CONSTRAINT "FK_206c3d2fb8e1933259ca97ba7a2" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
