import { Sequelize } from "sequelize";

// Example URI: postgres://username:password@host:5432/databasename
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

export default sequelize;
