import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';

class Pokemon extends Model {}

Pokemon.init({
  id: { type: DataTypes.INTEGER, primaryKey: true },
  name: DataTypes.STRING,
  types: DataTypes.STRING,
  abilities: DataTypes.STRING,
  stats: DataTypes.JSON,
  image: DataTypes.STRING,
  description: DataTypes.TEXT,
}, { 
  sequelize, 
  modelName: 'pokemon',
  tableName: 'pokemons',
  timestamps: true
});

export default Pokemon;