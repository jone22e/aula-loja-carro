# AutoManager Pro - Monorepo (Front + Back)

Projeto separado em duas aplicações:

- `front/`: interface React (Vite)
- `back/`: API Node.js + Prisma + PostgreSQL

## Banco de dados (PostgreSQL em container)

```bash
docker compose up -d
```

## Back-end (Node + Prisma)

```bash
cd back
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

API base: `http://localhost:3001/api`
Healthcheck: `GET /api/health`

## Front-end

```bash
cd front
npm install
npm run dev
```

## Observações

- O schema Prisma foi construído a partir dos tipos atuais do front (`Vehicle`, `Client`, `Sale`, `User`).
- Foi criado um adaptador de funções em `back/src/database/legacyDbAdapter.ts` com nomenclatura equivalente ao legado PHP informado.
