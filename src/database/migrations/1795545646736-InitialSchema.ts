import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1795545646736 implements MigrationInterface {
    name = 'InitialSchema1795545646736'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customer" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "document" character varying, "birthdate" date, "address" character varying, "phone" character varying, "userId" integer NOT NULL, CONSTRAINT "UQ_customer_user_document" UNIQUE ("userId", "document"), CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3f62b42ed23958b120c235f74d" ON "customer" ("userId") `);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying, "isActive" boolean NOT NULL DEFAULT true, "role" character varying(20) NOT NULL DEFAULT 'operator', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "counseling_data" ("id" SERIAL NOT NULL, "reason" text, "symptomsTime" text, "dailyLife" text, "hasHadTherapy" text, "expectations" text, "customerId" integer NOT NULL, CONSTRAINT "REL_de796140245054b91902894aad" UNIQUE ("customerId"), CONSTRAINT "PK_7184eab6825699d550ab8337bb6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chronological_cycle" ("id" SERIAL NOT NULL, "date" date NOT NULL, "cycle" text, "fase" text, "emotionalScale" text, "physicalScale" text, "order" integer NOT NULL, "customerId" integer NOT NULL, CONSTRAINT "PK_8a15b6e4c5aafadb573041e4090" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b509c0dc29b00b82f4d8b72fef" ON "chronological_cycle" ("customerId") `);
        await queryRunner.query(`CREATE TABLE "appointment" ("id" SERIAL NOT NULL, "date" date NOT NULL, "time" character varying NOT NULL, "customerId" integer NOT NULL, CONSTRAINT "PK_e8be1a53027415e709ce8a2db74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c048c6004b69354f46183f93a8" ON "appointment" ("customerId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0ac1415ad784e6df5c787f7b73" ON "appointment" ("date") `);
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "FK_3f62b42ed23958b120c235f74df" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "counseling_data" ADD CONSTRAINT "FK_de796140245054b91902894aadd" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chronological_cycle" ADD CONSTRAINT "FK_b509c0dc29b00b82f4d8b72fef6" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD CONSTRAINT "FK_c048c6004b69354f46183f93a85" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_c048c6004b69354f46183f93a85"`);
        await queryRunner.query(`ALTER TABLE "chronological_cycle" DROP CONSTRAINT "FK_b509c0dc29b00b82f4d8b72fef6"`);
        await queryRunner.query(`ALTER TABLE "counseling_data" DROP CONSTRAINT "FK_de796140245054b91902894aadd"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_3f62b42ed23958b120c235f74df"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0ac1415ad784e6df5c787f7b73"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c048c6004b69354f46183f93a8"`);
        await queryRunner.query(`DROP TABLE "appointment"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b509c0dc29b00b82f4d8b72fef"`);
        await queryRunner.query(`DROP TABLE "chronological_cycle"`);
        await queryRunner.query(`DROP TABLE "counseling_data"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3f62b42ed23958b120c235f74d"`);
        await queryRunner.query(`DROP TABLE "customer"`);
    }

}
