import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1765909714265 implements MigrationInterface {
    name = 'Migrations1765909714265'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "login_transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "txId" character varying(128) NOT NULL, "clientId" character varying(100) NOT NULL, "externalUserId" character varying(255), "authUserId" uuid, "challenge" text NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'PENDING', "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "authCodeHash" character varying(255), "approvedByDeviceId" uuid, "meta" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fdbd9e1f559a187aad76ce8af0c" UNIQUE ("txId"), CONSTRAINT "PK_8bd35d38b3719f8975df3873e17" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fdbd9e1f559a187aad76ce8af0" ON "login_transactions" ("txId") `);
        await queryRunner.query(`CREATE INDEX "IDX_44d80fe9ac7aae4fd09a618b3e" ON "login_transactions" ("expiresAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_f55f5342a8662b93653df1f66a" ON "login_transactions" ("clientId", "status") `);
        await queryRunner.query(`CREATE INDEX "IDX_0fe038d7e2fd3d265753f31182" ON "external_accounts" ("clientId", "authUserId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_0fe038d7e2fd3d265753f31182"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f55f5342a8662b93653df1f66a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_44d80fe9ac7aae4fd09a618b3e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fdbd9e1f559a187aad76ce8af0"`);
        await queryRunner.query(`DROP TABLE "login_transactions"`);
    }

}
