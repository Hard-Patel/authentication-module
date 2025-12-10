import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1765390872085 implements MigrationInterface {
    name = 'Migrations1765390872085'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public_keys" DROP CONSTRAINT "FK_1514b70586a28da3c2f4cafee2a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4df0b131821efdbea9a0e9b729"`);
        await queryRunner.query(`ALTER TABLE "public_keys" DROP CONSTRAINT "UQ_0dd1fca40287953fae71fbc155d"`);
        await queryRunner.query(`ALTER TABLE "public_keys" DROP CONSTRAINT "UQ_35191e079da7902972477d26c77"`);
        await queryRunner.query(`ALTER TABLE "public_keys" DROP COLUMN "deviceId"`);
        await queryRunner.query(`ALTER TABLE "public_keys" ADD "deviceId" uuid NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_4df0b131821efdbea9a0e9b729" ON "public_keys" ("userId", "deviceId") `);
        await queryRunner.query(`ALTER TABLE "public_keys" ADD CONSTRAINT "UQ_0dd1fca40287953fae71fbc155d" UNIQUE ("userId", "deviceId", "keyId")`);
        await queryRunner.query(`ALTER TABLE "public_keys" ADD CONSTRAINT "FK_1514b70586a28da3c2f4cafee2a" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public_keys" DROP CONSTRAINT "FK_1514b70586a28da3c2f4cafee2a"`);
        await queryRunner.query(`ALTER TABLE "public_keys" DROP CONSTRAINT "UQ_0dd1fca40287953fae71fbc155d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4df0b131821efdbea9a0e9b729"`);
        await queryRunner.query(`ALTER TABLE "public_keys" DROP COLUMN "deviceId"`);
        await queryRunner.query(`ALTER TABLE "public_keys" ADD "deviceId" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public_keys" ADD CONSTRAINT "UQ_35191e079da7902972477d26c77" UNIQUE ("id")`);
        await queryRunner.query(`ALTER TABLE "public_keys" ADD CONSTRAINT "UQ_0dd1fca40287953fae71fbc155d" UNIQUE ("userId", "deviceId", "keyId")`);
        await queryRunner.query(`CREATE INDEX "IDX_4df0b131821efdbea9a0e9b729" ON "public_keys" ("userId", "deviceId") `);
        await queryRunner.query(`ALTER TABLE "public_keys" ADD CONSTRAINT "FK_1514b70586a28da3c2f4cafee2a" FOREIGN KEY ("deviceId") REFERENCES "devices"("deviceId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
