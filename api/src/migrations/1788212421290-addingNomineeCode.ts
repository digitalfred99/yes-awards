import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingNomineeCode1788212421290 implements MigrationInterface {
    name = 'AddingNomineeCode1788212421290'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "nomineeCode" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_e189bcb300b8274735a2e640dcd" UNIQUE ("nomineeCode")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_e189bcb300b8274735a2e640dcd"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "nomineeCode"`);
    }

}
