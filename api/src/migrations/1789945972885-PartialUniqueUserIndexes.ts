import { MigrationInterface, QueryRunner } from "typeorm";

export class PartialUniqueUserIndexes1789945972885 implements MigrationInterface {
    name = 'PartialUniqueUserIndexes1789945972885'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_1e3d0240b49c40521aaeb953293"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_e189bcb300b8274735a2e640dcd"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_users_nomineeCode_active" ON "users"  ("nomineeCode") WHERE "isDeleted" = false`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_users_phoneNumber_active" ON "users"  ("phoneNumber") WHERE "isDeleted" = false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."UQ_users_phoneNumber_active"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_users_nomineeCode_active"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_e189bcb300b8274735a2e640dcd" UNIQUE ("nomineeCode")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_1e3d0240b49c40521aaeb953293" UNIQUE ("phoneNumber")`);
    }

}
