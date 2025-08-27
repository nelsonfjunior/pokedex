import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Pokemon from '../models/pokemon';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const findByName = async (req: Request, res: Response) => {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({ error: 'O parâmetro de busca "name" é obrigatório.' });
        }

        const pokemon = await Pokemon.findAll({
            where: {
                name: {
                    [Op.like]: `%${name}%`
                }
            }
        });

        if (!pokemon) {
            return res.status(404).json({ message: 'Pokémon não encontrado.' });
        }

        return res.status(200).json(pokemon);

    } catch (error) {
        console.error('Erro ao buscar Pokémon por nome:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
};

export const findAll = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1; 
        const limit = parseInt(req.query.limit as string) || 6; 
        const offset = (page - 1) * limit;

        const { count, rows } = await Pokemon.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [['id', 'ASC']]
        });

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Nenhum Pokémon encontrado.' });
        }

        return res.status(200).json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            pokemons: rows
        });
    } catch (error) {
        console.error('Erro ao buscar todos os Pokémons:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
};

export const generateAIDescription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pokemon = await Pokemon.findByPk(id);

    if (!pokemon) {
      return res.status(404).json({ message: 'Pokémon não encontrado.' });
    }

    if (!process.env.WEBHOOK_N8N) {
      throw new Error('WEBHOOK_N8N environment variable is not defined');
    }

    await axios.post(process.env.WEBHOOK_N8N, pokemon.toJSON());

    const pollInterval = 1000; 
    const timeoutMs = 15000;
    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
      await new Promise((r) => setTimeout(r, pollInterval));
      const pokemon = await Pokemon.findByPk(id);
      const description = (pokemon?.get('description') as string | undefined)?.trim();
      if (description && description.length > 0) {
        return res.status(200).json({ updatedPokemon: pokemon });
      }
    }

    return res.status(202).json({ message: 'Requisição recebida, descrição ainda não gerada. Tente novamente mais tarde.' });
  } catch (error) {
    console.error('Erro em generateAIDescription:', error);
    return res.status(500).json({ error: 'Erro ao conectar.' });
  }
};


export const updateDescription = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { description } = req.body;

        if (!description) {
            return res.status(400).json({ message: 'O campo "description" é obrigatório.' });
        }

        const [updatedRows] = await Pokemon.update(
            { description: description },
            { where: { id: id } }
        );

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Pokémon não encontrado ou não atualizado.' });
        }

        const updatedPokemon = await Pokemon.findByPk(id);
        return res.status(200).json(updatedPokemon);
    } catch (error) {
        console.error('Erro ao atualizar a descrição do Pokémon:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
};