import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

// Cria a primeira conta admin, que cadastra os operadores pelo sistema.
// Os dados vêm do ambiente (Render / .env), nunca do código:
//   ADMIN_EMAIL, ADMIN_PASSWORD (mín. 8 caracteres) e, opcional, ADMIN_NAME.
// Se já existir um usuário com esse e-mail, ele só é promovido a admin (a senha não muda).
export class SeedAdmin1795545700000 implements MigrationInterface {
  name = 'SeedAdmin1795545700000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME?.trim() || 'Administrador';

    if (!email || !password || password.length < 8) {
      throw new Error(
        'SeedAdmin: defina ADMIN_EMAIL e ADMIN_PASSWORD (mínimo 8 caracteres) nas variáveis de ambiente antes do primeiro deploy.',
      );
    }

    const hash = await bcrypt.hash(password, 10);
    await queryRunner.query(
      `INSERT INTO "user" ("email", "password", "name", "role", "isActive")
       VALUES ($1, $2, $3, 'admin', true)
       ON CONFLICT ("email") DO UPDATE SET "role" = 'admin', "isActive" = true`,
      [email, hash, name],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    if (email) {
      await queryRunner.query(`DELETE FROM "user" WHERE "email" = $1 AND "role" = 'admin'`, [email]);
    }
  }
}
