import { MigrationInterface, QueryRunner } from "typeorm";

export class NAME1758541178437 implements MigrationInterface {
    name = 'NAME1758541178437'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "link_clicks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "occurredAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userAgentHash" character varying(128), "ipHash" character varying(64), "ref" character varying(64), "profileId" uuid, "linkId" uuid, CONSTRAINT "PK_19d536461401f505e14ddf46ae6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ee35d8c488083ac17b2029ecf9" ON "link_clicks" ("occurredAt") `);
        await queryRunner.query(`CREATE TABLE "links" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(160) NOT NULL, "url" character varying(1024) NOT NULL, "orderIndex" integer NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, "kind" character varying(32) NOT NULL DEFAULT 'custom', "iconKey" character varying(64), "meta" jsonb, "clickCount" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "profileId" uuid, CONSTRAINT "PK_ecf17f4a741d3c5ba0b4c5ab4b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "media_assets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "kind" character varying(32) NOT NULL, "s3Key" character varying(512) NOT NULL, "contentType" character varying(128) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "profileId" uuid, CONSTRAINT "PK_ca47e9f67a5e5d8af1e75d66ee6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying(64) NOT NULL, "name" character varying(120) NOT NULL, "bio" character varying(280), "avatarUrl" character varying(512), "theme" jsonb, "isPublic" boolean NOT NULL DEFAULT true, "layoutMode" character varying(32) NOT NULL DEFAULT 'full_row_buttons', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ownerId" uuid, CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_db923a19f15d5ceaa2b27ecb58" ON "profiles" ("slug") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(320) NOT NULL, "passwordHash" character varying(255) NOT NULL, "displayName" character varying(120) NOT NULL, "onboardingState" character varying(32) NOT NULL DEFAULT 'none', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`ALTER TABLE "link_clicks" ADD CONSTRAINT "FK_206c3d2fb8e1933259ca97ba7a2" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "link_clicks" ADD CONSTRAINT "FK_113514c61e96e18aee03b799556" FOREIGN KEY ("linkId") REFERENCES "links"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "links" ADD CONSTRAINT "FK_847fa4b231e7f78e5a6d448c66f" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "media_assets" ADD CONSTRAINT "FK_b1a7db245fb47e3bc68af341741" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD CONSTRAINT "FK_c37303d3b952614569fcb8e12a7" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" DROP CONSTRAINT "FK_c37303d3b952614569fcb8e12a7"`);
        await queryRunner.query(`ALTER TABLE "media_assets" DROP CONSTRAINT "FK_b1a7db245fb47e3bc68af341741"`);
        await queryRunner.query(`ALTER TABLE "links" DROP CONSTRAINT "FK_847fa4b231e7f78e5a6d448c66f"`);
        await queryRunner.query(`ALTER TABLE "link_clicks" DROP CONSTRAINT "FK_113514c61e96e18aee03b799556"`);
        await queryRunner.query(`ALTER TABLE "link_clicks" DROP CONSTRAINT "FK_206c3d2fb8e1933259ca97ba7a2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_db923a19f15d5ceaa2b27ecb58"`);
        await queryRunner.query(`DROP TABLE "profiles"`);
        await queryRunner.query(`DROP TABLE "media_assets"`);
        await queryRunner.query(`DROP TABLE "links"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ee35d8c488083ac17b2029ecf9"`);
        await queryRunner.query(`DROP TABLE "link_clicks"`);
    }

}
