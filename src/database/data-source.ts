import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { types } from 'pg';

const PG_DATE_OID = 1082;
types.setTypeParser(PG_DATE_OID, (value: string) => value);

// Conexão única usada pelo Nest (AppModule) e pelo CLI do TypeORM (migrations).
// Em produção (Render) basta definir DATABASE_URL com a connection string do Neon.
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  // SSL com verificação de certificado (o Neon usa certificado válido).
  ssl: process.env.DB_SSL !== 'false',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  // O schema é controlado só por migrations, nunca por synchronize,
  // para não alterar tabelas de produção sem querer.
  synchronize: false,
  // Aplica migrations pendentes ao subir o app (deploy no Render cria/atualiza as tabelas).
  migrationsRun: true,
};

export default new DataSource(dataSourceOptions);
