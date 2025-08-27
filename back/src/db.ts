import { Sequelize } from "sequelize"; 
import dotenv from 'dotenv';

dotenv.config();

const dbName = process.env.DB_NAME as string; 
const dbUser = process.env.DB_USER as string;
const dbHost = process.env.DB_HOST as string;
const dbPassword = process.env.DB_PASSWORD as string;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  dialect: "mysql",
  host: dbHost,
});

export default sequelize;
