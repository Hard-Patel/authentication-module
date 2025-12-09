import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1765221171066 implements MigrationInterface {
    name = 'Migrations1765221171066'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" ADD "ownerUserId" uuid`);
        await queryRunner.query(`ALTER TABLE "public_keys" ADD CONSTRAINT "UQ_35191e079da7902972477d26c77" UNIQUE ("id")`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_a98d1e830f28f415a28ee8ec17c" FOREIGN KEY ("ownerUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "FK_a98d1e830f28f415a28ee8ec17c"`);
        await queryRunner.query(`ALTER TABLE "public_keys" DROP CONSTRAINT "UQ_35191e079da7902972477d26c77"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "ownerUserId"`);
    }

}
