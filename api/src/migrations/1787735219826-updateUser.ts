import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUser1787735219826 implements MigrationInterface {
    name = 'UpdateUser1787735219826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "category" character varying(255)`);
        await queryRunner.query(`CREATE TYPE "public"."users_interest_enum" AS ENUM('EXPLORING', 'COMMITTED', 'HIGHLY_COMMITTED', 'FULLY_COMMITTED')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "interest" "public"."users_interest_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "interest"`);
        await queryRunner.query(`DROP TYPE "public"."users_interest_enum"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "category"`);
    }

}
