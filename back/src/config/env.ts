import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT ?? 3001);
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL não definida. Copie back/.env.example para back/.env.');
}

export const env = {
  PORT,
  DATABASE_URL,
};
