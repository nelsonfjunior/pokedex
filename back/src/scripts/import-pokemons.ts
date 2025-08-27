import axios from 'axios';
import Pokemon from '../models/pokemon'
import dotenv from 'dotenv';
dotenv.config();

async function fetchAndSavePokemons() {
  const limit = parseInt(process.env.LIMIT_POKEMONS || "10");
  const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
  const pokemons = response.data.results;

  for (const p of pokemons) {
    const details = await axios.get(p.url);
    const data = details.data;

    await Pokemon.create({
      id: data.id,
      name: data.name,
      types: data.types.map((t: any) => t.type.name).join(','),
      abilities: data.abilities.map((a: any) => a.ability.name).join(','),
      stats: data.stats,
      image: data.sprites.front_default,
    });
  }

  console.log('Pokémons salvos no banco!');
}

fetchAndSavePokemons();