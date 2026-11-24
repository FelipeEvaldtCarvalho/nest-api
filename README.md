# Mind Flux API

NestJS + TypeORM + PostgreSQL (Neon). Deploy no Render.

## Rodar localmente

```bash
cp .env.example .env   # preencha DATABASE_URL e JWT_SECRET
pnpm install
pnpm start:dev
```

As migrations pendentes rodam sozinhas quando o app sobe (`migrationsRun`).

## Banco e migrations

- O schema é controlado **só por migrations** (`src/database/migrations`); `synchronize` fica desligado.
- Alterou uma entidade? Gere a migration e faça commit dela junto:
  ```bash
  pnpm migration:generate   # depois renomeie o arquivo gerado para algo descritivo
  pnpm migration:run
  ```
- A migration `SeedAdmin` cria a primeira conta admin a partir de `ADMIN_EMAIL`/`ADMIN_PASSWORD`.

## Perfis

- **admin**: gerencia operadores em `/users` (criar, editar, desativar, excluir) e também atende clientes.
- **operator**: só enxerga os próprios clientes, fichas, ciclos e agendamentos.

Não há cadastro público: contas são criadas pelo admin.

## Variáveis de ambiente

| Variável | Uso |
|---|---|
| `DATABASE_URL` | connection string do Neon |
| `JWT_SECRET` | segredo dos tokens |
| `JWT_EXPIRATION` | validade do token (padrão `1d`) |
| `CORS_ALLOWED_ORIGINS` | URLs do front, separadas por vírgula |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` | só para a migration `SeedAdmin` |
| `DB_SSL` | `false` apenas para Postgres local sem SSL |
