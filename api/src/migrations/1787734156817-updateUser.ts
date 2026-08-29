import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUser1787734156817 implements MigrationInterface {
    name = 'UpdateUser1787734156817'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "interest" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "interest" SET NOT NULL`);
    }

}
