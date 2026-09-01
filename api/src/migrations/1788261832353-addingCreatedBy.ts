import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingCreatedBy1788261832353 implements MigrationInterface {
    name = 'AddingCreatedBy1788261832353'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" ADD "createdBy" character varying(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "createdBy"`);
    }

}
