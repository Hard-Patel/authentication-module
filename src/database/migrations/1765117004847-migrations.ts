import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1765117004847 implements MigrationInterface {
    name = 'Migrations1765117004847'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "devices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deviceId" character varying(255) NOT NULL, "userId" uuid NOT NULL, "platform" character varying(50) NOT NULL, "pushToken" text, "deviceModel" character varying(100), "osVersion" character varying(50), "appVersion" character varying(50), "isActive" boolean NOT NULL DEFAULT true, "lastSeenAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b1514758245c12daf43486dd1f0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_666c9b59efda8ca85b29157152" ON "devices" ("deviceId") `);
        await queryRunner.query(`CREATE TABLE "public_keys" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "deviceId" character varying(255) NOT NULL, "keyId" character varying(255), "publicKey" text NOT NULL, "algorithm" character varying(32) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "metadata" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_35191e079da7902972477d26c77" UNIQUE ("id"), CONSTRAINT "UQ_0dd1fca40287953fae71fbc155d" UNIQUE ("userId", "deviceId", "keyId"), CONSTRAINT "PK_35191e079da7902972477d26c77" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4df0b131821efdbea9a0e9b729" ON "public_keys" ("userId", "deviceId") `);
        await queryRunner.query(`CREATE TABLE "clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "clientId" character varying(100) NOT NULL, "clientSecretHash" text NOT NULL, "name" character varying(255) NOT NULL, "redirectUris" text array NOT NULL DEFAULT '{}', "metadata" jsonb, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c8526f623c0beed53b60cb31bf" ON "clients" ("clientId") `);
        await queryRunner.query(`CREATE TABLE "external_accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "clientId" character varying(100) NOT NULL, "externalUserId" character varying(255) NOT NULL, "authUserId" uuid NOT NULL, "metadata" jsonb, "linkedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0fe038d7e2fd3d265753f311826" UNIQUE ("clientId", "authUserId"), CONSTRAINT "UQ_c866e0bb086feca51baa997514a" UNIQUE ("clientId", "externalUserId"), CONSTRAINT "PK_48de4cf673dd62798b19df4f7bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_03cce27a943185578ceb6e34ff" ON "external_accounts" ("clientId") `);
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone")`);
        await queryRunner.query(`ALTER TABLE "devices" ADD CONSTRAINT "FK_e8a5d59f0ac3040395f159507c6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public_keys" ADD CONSTRAINT "FK_851af8666be9d63d5b6dc0e52c2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public_keys" ADD CONSTRAINT "FK_1514b70586a28da3c2f4cafee2a" FOREIGN KEY ("deviceId") REFERENCES "devices"("deviceId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "external_accounts" ADD CONSTRAINT "FK_03cce27a943185578ceb6e34ffb" FOREIGN KEY ("clientId") REFERENCES "clients"("clientId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "external_accounts" ADD CONSTRAINT "FK_303df6b55814a8b197a387851b6" FOREIGN KEY ("authUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "external_accounts" DROP CONSTRAINT "FK_303df6b55814a8b197a387851b6"`);
        await queryRunner.query(`ALTER TABLE "external_accounts" DROP CONSTRAINT "FK_03cce27a943185578ceb6e34ffb"`);
        await queryRunner.query(`ALTER TABLE "public_keys" DROP CONSTRAINT "FK_1514b70586a28da3c2f4cafee2a"`);
        await queryRunner.query(`ALTER TABLE "public_keys" DROP CONSTRAINT "FK_851af8666be9d63d5b6dc0e52c2"`);
        await queryRunner.query(`ALTER TABLE "devices" DROP CONSTRAINT "FK_e8a5d59f0ac3040395f159507c6"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_a000cca60bcf04454e727699490"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_03cce27a943185578ceb6e34ff"`);
        await queryRunner.query(`DROP TABLE "external_accounts"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c8526f623c0beed53b60cb31bf"`);
        await queryRunner.query(`DROP TABLE "clients"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4df0b131821efdbea9a0e9b729"`);
        await queryRunner.query(`DROP TABLE "public_keys"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_666c9b59efda8ca85b29157152"`);
        await queryRunner.query(`DROP TABLE "devices"`);
    }

}
