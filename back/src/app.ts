import db from "./db";
import express from "express";
import Pokemon from "./models/pokemon";
import dotenv from 'dotenv';
import pokemonsRoutes from "./routes/pokemonRoutes";
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const host = process.env.HOST || '0.0.0.0';

app.use(express.json());
app.use(cors());
app.use('/api/pokemons', pokemonsRoutes);

process.on('uncaughtException', (err) => {
  console.error('uncaughtException:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('unhandledRejection:', reason);
});

async function start() {
  try {
    await db.authenticate();
    console.log('Banco autenticado. Modelo Pokemon carregado:', !!Pokemon);

    await db.sync({ alter: true });

    app.listen(port, host, () => {
      console.log(`Servidor rodando em http://${host}:${port}`);
    });

  } catch (error) {
    console.error('Erro ao iniciar a API:', error);
    process.exit(1);
  }
}

start();